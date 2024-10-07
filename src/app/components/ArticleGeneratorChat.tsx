"use client";
import React, { useState, useEffect } from "react";
import { ChatSession, Message } from "../types";
import { createChatSession, addMessage, getAIResponse } from "../utils/api";
import ChatInterface from "./ChatInterface";

interface ArticleGeneratorChatProps {
  initialMessage?: Message;
}

const ArticleGeneratorChat: React.FC<ArticleGeneratorChatProps> = ({
  initialMessage,
}) => {
  const [session, setSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const newSession = await createChatSession(
        "SYS_MSG_SEO_ARTICLE_GENERATOR",
        "anthropic/claude-3-5-sonnet-20240620"
      );
      setSession(newSession);

      if (initialMessage) {
        // Add the initial message to the session
        await addMessage(newSession.id, initialMessage);

        // Get the AI response
        const aiResponse = await getAIResponse(newSession.id);

        // Update the session with both the initial message and AI response
        const updatedSession = {
          ...newSession,
          messages: [initialMessage, aiResponse],
        };
        setSession(updatedSession);
      }
    };
    initSession();
  }, [initialMessage]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="article-generator-chat">
      <h2>SEO Article Generator</h2>

      <ChatInterface session={session} />
    </div>
  );
};

export default ArticleGeneratorChat;
