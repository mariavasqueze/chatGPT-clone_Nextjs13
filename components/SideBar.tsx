"use client";

import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import NewChat from "./NewChat";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";

function SideBar() {
  const { data: session } = useSession();

  const [chats, loading, error] = useCollection(
    // take the chats saved under that user
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  return (
    <div className="p-2 flex flex-col h-screen">
      <div className="flex-1">
        <div>
          <NewChat />

          <div className="hidden sm:inline ">
            <ModelSelection />
          </div>
          <div className="flex flex-col space-y-2 my-2">
            {loading && (
              <div className="animate-pulse text-center text-white">
                <p>Loading Chats...</p>
              </div>
            )}
            {chats?.docs.map((chat) => {
              return <ChatRow key={chat.id} id={chat.id} />;
            })}
          </div>
        </div>
      </div>
      {/* using ! because the img can be coming from a google url that is not whitelisted and next will show error */}
      {session && (
        <img
          onClick={() => signOut()}
          src={session.user?.image!}
          alt="user profile image"
          className="h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
        />
      )}
    </div>
  );
}

export default SideBar;
