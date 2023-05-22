"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { serverTimestamp } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, addDoc } from "firebase/firestore";
import useSWR from "swr";
import { db } from "../firebase";
import toast from "react-hot-toast";
import ModelSelection from "./ModelSelection";

type ChatInputProps = {
  chatId: string;
};

function ChatInput({ chatId }: ChatInputProps) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");

  // useSWR to get the model
  // if using the same key as in ModelSelection is going to be using the same value
  const { data: model, mutate: setModal } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });
  //gpt-3.5-turbo

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };

    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    // Toast Notification to say loading
    const notification = toast.loading("ChatGPT is thinking...");

    // Fetch method to backend to cominicate with API

    let res = await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    }).then(() => {
      // Toast notification to show success
      toast.success("ChatGPT has responded!", {
        id: notification,
      });
    });
  };

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
      <form className="p-5 space-x-5 flex" onSubmit={sendMessage}>
        <input
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Type yout text here..."
        />
        <button
          type="submit"
          disabled={!prompt || !session}
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
        </button>
      </form>

      <div className="md:hidden">
        <ModelSelection />
      </div>
    </div>
  );
}

export default ChatInput;
