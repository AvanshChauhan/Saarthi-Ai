import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv"
dotenv.config()
const tavilySearch = new TavilySearch({
  maxResults: 5,
  topic: "general",
});
const server = new McpServer({
  name: "saarthi-Ai-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "web_search_Tool",
  {
    description: `Search the internet for relevant, accurate, and up-to-date information
to answer the user's query.

Use this tool when:
- The user asks for current or real-time information.
- The answer requires recent news, updates, or announcements.
- The user asks about companies, products, technologies, or public figures.
- The user needs research, fact-checking, or information verification.
- The user requests websites, documentation, articles, or online resources.
- The answer depends on information that may have changed over time.
- You need to verify facts instead of relying solely on existing knowledge.

Instructions:
- Generate search queries based on the user's actual intent.
- Prefer authoritative sources, official websites, and trusted publications.
- Search for multiple perspectives when necessary.
- Prioritize recent information for time-sensitive queries.
- Do not assume that the first search result is accurate.
- Distinguish verified facts from opinions and speculation.
- Never fabricate search results, URLs, citations, or information.
- Summarize findings in your own words.
- Include relevant source titles and URLs in the final response.
- Clearly communicate when reliable information cannot be found.

Do not use this tool for simple conversational questions,
basic programming concepts, mathematical calculations,
or information already provided by the user.

Return structured search results containing:
- Title
- URL
- Relevant content or snippet
- Source name
- Publication date, when available

The tool retrieves information; it does not independently
guarantee the accuracy of search results.
    `,
    inputSchema: z.object({
      query: z.string(),
    }),
  },
  async ({ query }) => {
    try {
      const result = await tavilySearch.invoke({ query });
      if (result.error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Web search failed: ${result.error}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    } catch (error) {
      console.error("Web search failed:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Web search failed.",
          },
        ],
      };
    }
  },
);

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server started successfully");
};
main().catch((error) => {
  console.error("MCP server failed to start:", error);
  process.exit(1);
});
