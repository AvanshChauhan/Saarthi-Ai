import api from "@/api";

export const chat = async (message, agentId) => {
  const { data } = await api.post("/api/talk/chat", {
    message,
    ...(agentId ? { agentId } : {}),
  });
  return data;
};