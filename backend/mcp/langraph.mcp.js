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
let toolsPromise;
export const getMcpTools = () => {
  if (!toolsPromise) {
    toolsPromise = adapter.listTools().catch((error) => {
      toolsPromise = undefined;
      throw error;
    });
  }
  return toolsPromise;
};
export default adapter;
