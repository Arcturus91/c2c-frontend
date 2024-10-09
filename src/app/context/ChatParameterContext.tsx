"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface ChatParameterContextType {
  currentModel: string;
  contentType: string;
  temperature: number;
  audience: string;
  funnelStage: string;
  setCurrentModel: (model: string) => void;
  setContentType: (type: string) => void;
  setTemperature: (temp: number) => void;
  setAudience: (audience: string) => void;
  setFunnelStage: (stage: string) => void;
  isSidebarLocked: boolean;
  setIsSidebarLocked: (locked: boolean) => void;
}

const ChatParameterContext = createContext<
  ChatParameterContextType | undefined
>(undefined);

export const ChatParameterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentModel, setCurrentModel] = useState<string>(
    "anthropic/claude-3-5-sonnet-20240620"
  );
  const [contentType, setContentType] = useState<string>("article");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [audience, setAudience] = useState<string>("teacher");
  const [funnelStage, setFunnelStage] = useState<string>("awareness");
  const [isSidebarLocked, setIsSidebarLocked] = useState<boolean>(false);
  return (
    <ChatParameterContext.Provider
      value={{
        currentModel,
        contentType,
        temperature,
        audience,
        funnelStage,
        setCurrentModel,
        setContentType,
        setTemperature,
        setAudience,
        setFunnelStage,
        isSidebarLocked,
        setIsSidebarLocked,
      }}
    >
      {children}
    </ChatParameterContext.Provider>
  );
};

export const useChatParameters = () => {
  const context = useContext(ChatParameterContext);
  if (context === undefined) {
    throw new Error(
      "useChatParameters must be used within a ChatParameterProvider"
    );
  }
  return context;
};
