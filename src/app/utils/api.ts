import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust this to your FastAPI server URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

export const createChatSession = async (
  type: "SYS_MSG_SEO_OUTLINER" | "SYS_MSG_SEO_ARTICLE_GENERATOR",
  model: string
) => {
  const response = await api.post(`/chat_sessions/${type}`, { model });
  console.log("createChatSession", response.data, model);
  return response.data;
};

export const getChatSession = async (sessionId: string) => {
  const response = await api.get(`/chat_sessions/${sessionId}`);
  console.log("getChatSession", response.data);
  return response.data;
};

export const addMessage = async (
  sessionId: string,
  message: { role: string; content: string }
) => {
  const response = await api.post(
    `/chat_sessions/${sessionId}/messages`,
    message
  );
  console.log("addMessage", response.data);
  return response.data;
};

export const getAIResponse = async (sessionId: string) => {
  const response = await api.post(`/chat_sessions/${sessionId}/ai_response`);
  console.log("getAIResponse", response.data);
  return response.data;
};

export const updateModel = async (sessionId: string, model: string) => {
  const type = "SYS_MSG_SEO_OUTLINER";
  const response = await api.post(`/chat_sessions/${type}`, { model });

  console.log("updateModel", response.data);
  return response.data;
};

export const getS3PresignedPost = async (
  fileName: string,
  fileType: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-upload-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName, fileType }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get presigned POST URL");
  }

  return response.json();
};
