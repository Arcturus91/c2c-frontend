"use client";
import React, { useState, useEffect } from "react";
import { Message, ChatSession } from "../types";
import { addMessage, getAIResponse } from "../utils/api";

interface ChatInterfaceProps {
  session: ChatSession;
  onAccept?: (lastMessage: Message) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ session, onAccept }) => {
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages(session.messages);
  }, [session]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: "user", content: input };
      setMessages([...messages, userMessage]);
      await addMessage(session.id, userMessage);
      setInput("");

      const aiResponse = await getAIResponse(session.id);
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
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
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message here..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {onAccept && (
        <button onClick={() => onAccept(messages[messages.length - 1])}>
          Accept Outline
        </button>
      )}
    </div>
  );
};

export default ChatInterface;
