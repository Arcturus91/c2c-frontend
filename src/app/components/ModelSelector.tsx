import React from "react";
import { updateModel } from "../utils/api";
import { useChatParameters } from "../context/ChatParameterContext";

const MODELS = [
  "anthropic/claude-3-5-sonnet-20240620",
  "openai/gpt-4-turbo-preview",
  "openai/gpt-3.5-turbo",
];

interface ModelSelectorProps {
  sessionId: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ sessionId }) => {
  const { currentModel, setCurrentModel, setIsSidebarLocked } =
    useChatParameters();

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    await updateModel(sessionId, newModel);
    setCurrentModel(newModel);
    setIsSidebarLocked(false);
  };

  return (
    <div className="model-selector">
      <label htmlFor="model-select">Select Model: </label>
      <select
        id="model-select"
        value={currentModel}
        onChange={handleModelChange}
      >
        {MODELS.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
