import { MCPAdapter } from "@langchain/mcp-adapters";
import path from "node:path";
import { fileURLToPath } from "node:url";
const _file = fileURLToPath(import.meta.url);
const directoryName = path.dirname(_file);
const adapter = new MCPAdapter({
  servers: {
    saarthi: {
      transport: "stdio",
      command: process.execPath,
      args: [path.join(directoryName, "server.js")],
    },
  },
});
export const SUPPORTED_AGENT_TOOL_IDS = new Set(["web-search"]);

const MCP_TOOL_NAMES = {
  "web-search": "saarthi_web_search_Tool",
};

export const getUnsupportedAgentToolIds = (agentTools = []) =>
  agentTools
    .map((tool) => (typeof tool === "string" ? tool : tool?.type))
    .filter((toolId) => toolId && !SUPPORTED_AGENT_TOOL_IDS.has(toolId));

let toolsPromise;
const getAvailableMcpTools = () => {
  if (!toolsPromise) {
    toolsPromise = adapter.listTools().catch((error) => {
      toolsPromise = undefined;
      throw error;
    });
  }
  return toolsPromise;
};

export const getMcpTools = async (agentTools = []) => {
  const selectedIds = agentTools
    .map((tool) => (typeof tool === "string" ? tool : tool?.type))
    .filter(Boolean);
  const unsupportedIds = getUnsupportedAgentToolIds(agentTools);
  if (unsupportedIds.length > 0) {
    throw new Error(`Unsupported agent tool(s): ${unsupportedIds.join(", ")}`);
  }

  if (selectedIds.length === 0) {
    return [];
  }

  const selectedMcpNames = new Set(
    selectedIds.map((toolId) => MCP_TOOL_NAMES[toolId]),
  );
  const availableTools = await getAvailableMcpTools();
  const selectedTools = availableTools.filter((tool) =>
    selectedMcpNames.has(tool.name),
  );
  const missingTools = [...selectedMcpNames].filter(
    (toolName) => !selectedTools.some((tool) => tool.name === toolName),
  );
  if (missingTools.length > 0) {
    throw new Error(`Configured MCP tool(s) are unavailable: ${missingTools.join(", ")}`);
  }

  return selectedTools;
};

export default adapter;
