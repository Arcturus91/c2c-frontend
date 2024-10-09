"use client";

import React, { useState, useEffect } from "react";
import { ChatSession, Message } from "../types";
import {
  createChatSession,
  addMessage,
  getAIResponse,
  getS3PresignedPost,
} from "../utils/api";
import ChatInterface from "./ChatInterface";
import { FaSpinner } from "react-icons/fa";
import { useModel } from "../context/ModelContext";

interface ArticleGeneratorChatProps {
  initialMessage?: Message;
}

const ArticleGeneratorChat: React.FC<ArticleGeneratorChatProps> = ({
  initialMessage,
}) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { currentModel } = useModel();

  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const newSession = await createChatSession(
          "SYS_MSG_SEO_ARTICLE_GENERATOR",
          currentModel
        );
        setSession(newSession);

        if (initialMessage) {
          await addMessage(newSession.id, initialMessage);
          const aiResponse = await getAIResponse(newSession.id);
          const updatedSession = {
            ...newSession,
            messages: [initialMessage, aiResponse],
          };
          setSession(updatedSession);
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        setError("Failed to initialize chat session. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, [initialMessage, currentModel]);

  const handleAcceptContent = async () => {
    if (!session || session.messages.length === 0) {
      setError("No content to save. Please generate content first.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);

      const lastMessage = session.messages[session.messages.length - 1];
      const content = lastMessage.content;
      const fileName = `${session.id}.txt`;

      // Get the presigned POST data
      const presignedPostData = await getS3PresignedPost(
        fileName,
        "text/plain"
      );

      // Create a FormData object and append the necessary fields
      const formData = new FormData();
      Object.entries(presignedPostData.fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append(
        "file",
        new Blob([content], { type: "text/plain" }),
        fileName
      );

      // Upload to S3 using the presigned POST URL
      const uploadResponse = await fetch(presignedPostData.url, {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        setSaveSuccess(true);
        console.log("Upload successful");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      setError("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="article-generator-chat">
        <h2>SEO Article Generator</h2>
        <div className="loading-spinner">
          <FaSpinner className="animate-spin text-4xl" />
          <p>Initializing chat session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-generator-chat">
        <h2>SEO Article Generator</h2>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
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
    <div className="article-generator-chat">
      <h2>SEO Article Generator</h2>
      <ChatInterface session={session} />
      <div className="accept-content">
        <button
          onClick={handleAcceptContent}
          disabled={isSaving}
          className="accept-button"
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Accept and Save Content"
          )}
        </button>
        {saveSuccess && (
          <p className="save-success">Content saved successfully!</p>
        )}
      </div>
    </div>
  );
};

export default ArticleGeneratorChat;
