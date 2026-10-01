const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StreamableHTTPServerTransport } = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const express = require("express");
const { z } = require("zod");

const server = new McpServer({
  name: "james-first-server",
  version: "1.0.0",
});

// --- The dish: a get_quote tool ---
const quotes = [
  "The best time to start was yesterday. The next best time is now.",
  "Small steps every day add up to big results.",
  "You don't have to be great to start, but you have to start to be great.",
  "Discipline beats motivation.",
];

server.registerTool(
  "get_quote",
  {
    title: "Get Quote",
    description: "Returns a random motivational quote. Use when the user wants inspiration or a quote.",
    inputSchema: {},
  },
  async () => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return {
      content: [{ type: "text", text: quote }],
    };
  }
);

// --- A real, useful tool: live crypto price ---
server.registerTool(
  "get_crypto_price",
  {
    title: "Get Crypto Price",
    description: "Get the current USD price of a cryptocurrency by its id (e.g. bitcoin, ethereum, solana).",
    inputSchema: {
      coin: z.string().describe("The coin id, like 'bitcoin' or 'ethereum'."),
    },
  },
  async ({ coin }) => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;
    const res = await fetch(url);
    const data = await res.json();
    const price = data[coin] ? data[coin].usd : "unknown";
    return {
      content: [{ type: "text", text: `The current price of ${coin} is $${price} USD.` }],
    };
  }
);

const app = express();
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ip=${req.headers["x-forwarded-for"] || req.ip} ua=${req.headers["user-agent"]}`);
  next();
});app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("James's MCP server is running.");
});

app.post("/mcp", async (req, res) => {
  console.log(`[${new Date().toISOString()}] Incoming MCP request`);
  try {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    console.log(`[${new Date().toISOString()}] Request handled successfully`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] MCP request failed:`, err);
    res.status(500).json({ error: "Something went wrong processing the request." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`James's MCP server (HTTP) running on port ${PORT}`);
});
