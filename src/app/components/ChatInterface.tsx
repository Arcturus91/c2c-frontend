"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  ComponentPropsWithoutRef,
} from "react";
import { Message, ChatSession } from "../types";
import { addMessage, getAIResponse } from "../utils/api";
import { FaSpinner } from "react-icons/fa";
import { useChatParameters } from "../context/ChatParameterContext";
import ReactMarkdown from "react-markdown";

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

  const renderMessage = (msg: Message) => {
    return (
      <div className={`message ${msg.role === "user" ? "user" : "assistant"}`}>
        <span className="message-emoji">
          {msg.role === "user" ? "👤" : "💻"}
        </span>
        <div className="message-content">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc ml-4 mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-4 mb-2">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mb-2">{children}</h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">
                  {children}
                </blockquote>
              ),
              code: ({
                inline,
                className,
                children,
                ...props
              }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <pre className="bg-gray-100 rounded p-2 overflow-x-auto">
                    <code className={`language-${match[1]}`} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-100 rounded px-1" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <React.Fragment key={index}>{renderMessage(msg)}</React.Fragment>
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
