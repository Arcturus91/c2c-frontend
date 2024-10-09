"use client";
import React, { useState } from "react";
import ArticleGeneratorChat from "./components/ArticleGeneratorChat";
import OutlinerChat from "./components/OutlinerChat";
import ModelSelector from "./components/ModelSelector";
import { Message } from "./types";
import { useModel } from "./context/ModelContext";

const Home: React.FC = () => {
  const [acceptedOutline, setAcceptedOutline] = useState<Message | null>(null);
  const { currentModel } = useModel();

  const handleAcceptOutline = (lastMessageFromAssistant: Message) => {
    const acceptedMessage = {
      content: lastMessageFromAssistant.content,
      role: "user",
    };
    console.log("handleAcceptOutline", acceptedMessage);
    setAcceptedOutline(acceptedMessage);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>SEO Content Generator</h2>
        <ModelSelector
          sessionId="your-session-id" // You'll need to provide a real session ID
        />
        {/* Add any other sidebar content here */}
      </div>
      <div className="main-content">
        <h1>Class2Class chat interface</h1>
        <div className="chat-container">
          <OutlinerChat onAccept={handleAcceptOutline} />
          {acceptedOutline && (
            <ArticleGeneratorChat initialMessage={acceptedOutline} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
