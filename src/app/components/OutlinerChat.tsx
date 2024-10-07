"use client";
import React, { useState, useEffect } from "react";
import { ChatSession, Message } from "../types";
import { createChatSession } from "../utils/api";
import ChatInterface from "./ChatInterface";

interface OutlinerChatProps {
  onAccept: (lastMessage: Message) => void;
}

const OutlinerChat: React.FC<OutlinerChatProps> = ({ onAccept }) => {
  const [session, setSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const newSession = await createChatSession(
        "SYS_MSG_SEO_OUTLINER",
        "anthropic/claude-3-5-sonnet-20240620"
      );
      setSession(newSession);
    };
    initSession();
  }, []);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="outliner-chat">
      <h2>SEO Outliner</h2>

      <ChatInterface session={session} onAccept={onAccept} />
    </div>
  );
};

export default OutlinerChat;
