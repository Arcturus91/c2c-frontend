export interface Message {
  role: string;
  content: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  model: string;
  system_prompt: string;
}
