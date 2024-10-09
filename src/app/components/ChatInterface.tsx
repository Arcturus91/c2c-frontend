"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Message, ChatSession } from "../types";
import { addMessage, getAIResponse } from "../utils/api";
import { FaSpinner } from "react-icons/fa";
import { useChatParameters } from "../context/ChatParameterContext";

interface ChatInterfaceProps {
  session: ChatSession;
  onAccept?: (lastMessage: Message) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ session, onAccept }) => {
  const { setIsSidebarLocked } = useChatParameters();
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages(session.messages);
  }, [session]);

  // Use useMemo to memoize the hasAssistantMessage value
  const hasAssistantMessage = useMemo(
    () => messages.some((msg) => msg.role === "assistant"),
    [messages]
  );

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: "user", content: input };
      setMessages([...messages, userMessage]);
      await addMessage(session.id, userMessage);
      setInput("");

      setIsLoading(true);
      setIsSidebarLocked(true);
      const aiResponse = await getAIResponse(session.id);
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <span className="message-emoji">
              {msg.role === "user" ? "👤" : "💻"}
            </span>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <span className="message-emoji">
              <FaSpinner className="animate-spin" />
            </span>
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? <FaSpinner className="animate-spin" /> : "Send"}
        </button>
      </div>
      {onAccept && (
        <button
          onClick={() => onAccept(messages[messages.length - 1])}
          disabled={isLoading || !hasAssistantMessage}
          className={`
            px-4 py-2 rounded mt-4
            ${
              isLoading || !hasAssistantMessage
                ? "bg-gray-300 text-black cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }
            transition-colors duration-200
          `}
        >
          Accept Outline
        </button>
      )}
    </div>
  );
};

export default ChatInterface;
