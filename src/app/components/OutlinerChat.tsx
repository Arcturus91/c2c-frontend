"use client";
import React, { useState, useEffect } from "react";
import { ChatSession, Message } from "../types";
import { createChatSession } from "../utils/api";
import ChatInterface from "./ChatInterface";
import { FaSpinner } from "react-icons/fa";
import { useChatParameters } from "../context/ChatParameterContext";

interface OutlinerChatProps {
  onAccept: (lastMessage: Message) => void;
}

const OutlinerChat: React.FC<OutlinerChatProps> = ({ onAccept }) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentModel, contentType, temperature, audience, funnelStage } =
    useChatParameters();

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSession = await createChatSession(
          "SYS_MSG_SEO_OUTLINER",
          currentModel,
          contentType,
          temperature,
          audience,
          funnelStage
        );
        setSession(newSession);
      } catch (error) {
        console.error("Error initializing session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, [currentModel]);

  if (isLoading) {
    return (
      <div className="outliner-chat">
        <h2>SEO Outliner</h2>
        <div className="loading-spinner">
          <FaSpinner className="animate-spin text-4xl" />
          <p>Initializing chat session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        Error: Unable to create chat session. Possible: Backend not working
      </div>
    );
  }

  return (
    <div className="outliner-chat">
      <h2>SEO Outliner</h2>
      <ChatInterface session={session} onAccept={onAccept} />
    </div>
  );
};

export default OutlinerChat;
