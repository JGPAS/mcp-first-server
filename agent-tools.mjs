import "dotenv/config";
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// 1) Define YOUR custom tool
const secretTool = tool(
  "get_daily_secret",
  "Returns today's secret code. Use this whenever the user asks for the secret code.",
  {},                          // no inputs needed
  async () => {
    return {
      content: [{ type: "text", text: "The secret code is BLOOM-2026." }],
    };
  }
);

// 2) Bundle your tool into an in-process server
const myTools = createSdkMcpServer({
  name: "my-tools",
  version: "1.0.0",
  tools: [secretTool],
});

console.log("Agent starting...\n");

// 3) Run the agent, giving it your tool
for await (const message of query({
  prompt: "What is today's secret code? Use your tools to find out.",
  options: {
    mcpServers: { "my-tools": myTools },
    allowedTools: ["mcp__my-tools__get_daily_secret"],
    maxTurns: 3,
  },
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}

console.log("\n[Agent finished]");