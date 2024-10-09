"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface ModelContextType {
  currentModel: string;
  setCurrentModel: (model: string) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentModel, setCurrentModel] = useState<string>(
    "anthropic/claude-3-5-sonnet-20240620"
  );

  return (
    <ModelContext.Provider value={{ currentModel, setCurrentModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
};
