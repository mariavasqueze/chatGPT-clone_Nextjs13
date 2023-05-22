import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import query from "../../lib/queryApi";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: "Please provide a prompt" });
    return;
  }
  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID!" });
    return;
  }

  // ChatGPT query
  const response = await query(prompt, chatId, model);

  console.log("res", response);

  const message: Message = {
    text: response || "ChatGPT can not find an answer for that!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      avatar: "https://links.papareact.com/89k",
    },
  };

  console.log("message", message);

  const safeEmail = (session?.user?.email || "").replace(/\./g, "_");
  await adminDb
    .collection("users")
    .doc(safeEmail)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  res.status(200).json({ answer: message.text });
}
