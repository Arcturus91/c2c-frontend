"use client";
import React, { useState } from "react";
import ArticleGeneratorChat from "./components/ArticleGeneratorChat";
import OutlinerChat from "./components/OutlinerChat";
import ModelSelector from "./components/ModelSelector";
import { Message } from "./types";

const Home: React.FC = () => {
  const [acceptedOutline, setAcceptedOutline] = useState<Message | null>(null);
  const [currentModel, setCurrentModel] = useState<string>(
    "anthropic/claude-3-5-sonnet-20240620"
  );

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
          currentModel={currentModel}
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
