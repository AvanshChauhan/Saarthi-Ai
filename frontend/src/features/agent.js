import api from "@/api";

const normalizeAgent = (agent) => ({
  ...agent,
  id: String(agent._id ?? agent.id),
  name: agent.agentName ?? agent.name,
  description: agent.description || "A custom Saarthi AI agent.",
  tools: Array.isArray(agent.tools)
    ? agent.tools
        .map((tool) => (typeof tool === "string" ? tool : tool?.type))
        .filter(Boolean)
    : [],
});

/** Create an agent for the currently authenticated user. */
export const createAgent = async ({ name, description, knowledgeBase, instructions, tools }) => {
  const { data } = await api.post("/api/agent/create-agent", {
    name,
    description,
    knowledgeBase,
    instructions,
    tools,
  });
  return { ...data, agent: data.agent ? normalizeAgent(data.agent) : data.agent };
};

/** Fetch all agents belonging to the currently authenticated user. */
export const getAllAgent = async () => {
  const { data } = await api.get("/api/agent/get-agent");
  return {
    ...data,
    allAgent: Array.isArray(data.allAgent) ? data.allAgent.map(normalizeAgent) : [],
  };
};

/** Fetch one agent by its database id. */
export const getAgentById = async (id) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("An agent id is required.");
  }

  const { data } = await api.get(`/api/agent/${encodeURIComponent(id)}`);
  return { ...data, agent: data.agent ? normalizeAgent(data.agent) : data.agent };
};

/** Delete one agent by its database id. */
export const deleteAgent = async (id) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("An agent id is required.");
  }

  const { data } = await api.delete(`/api/agent/${encodeURIComponent(id)}`);
  return data;
};
