"use client";
import React, { useState } from "react";
import ArticleGeneratorChat from "./components/ArticleGeneratorChat";
import OutlinerChat from "./components/OutlinerChat";
import Sidebar from "./components/Sidebar";
import { Message } from "./types";

const Home: React.FC = () => {
  const [acceptedOutline, setAcceptedOutline] = useState<Message | null>(null);

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
        <Sidebar />
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
