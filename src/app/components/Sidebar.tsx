import React from "react";
import ModelSelector from "./ModelSelector";
import { useChatParameters } from "../context/ChatParameterContext";

const contentTypes = ["article", "email", "ad", "landing page", "video script"];
const audiences = ["teacher", "student", "headmaster", "parent"];
const funnelStages = ["awareness", "consideration", "interest"];

const Sidebar: React.FC = () => {
  const {
    contentType,
    temperature,
    audience,
    funnelStage,
    setContentType,
    setTemperature,
    setAudience,
    setFunnelStage,
    isSidebarLocked,
  } = useChatParameters();

  return (
    <div className="sidebar">
      <h2>SEO Content Generator</h2>
      <ModelSelector sessionId="your-session-id" />

      <div className="sidebar-section">
        <label htmlFor="content-type">Content Type:</label>
        <select
          id="content-type"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          disabled={isSidebarLocked}
        >
          {contentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <label htmlFor="temperature">Temperature:</label>
        <input
          disabled={isSidebarLocked}
          type="range"
          id="temperature"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
        />
        <span>{temperature}</span>
      </div>

      <div className="sidebar-section">
        <label htmlFor="audience">Audience:</label>
        <select
          id="audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          disabled={isSidebarLocked}
        >
          {audiences.map((aud) => (
            <option key={aud} value={aud}>
              {aud}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <label htmlFor="funnel-stage">Funnel Stage:</label>
        <select
          id="funnel-stage"
          value={funnelStage}
          onChange={(e) => setFunnelStage(e.target.value)}
          disabled={isSidebarLocked}
        >
          {funnelStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
