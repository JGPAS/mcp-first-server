# mcp-first-server

A Model Context Protocol (MCP) server built with the official MCP SDK, available both as a
local stdio server (for Claude Desktop) and as a cloud-deployed HTTP server reachable over the
network.

**Live demo:** https://mcp-first-server.onrender.com (note: free-tier hosting, first request
after inactivity may take up to ~50s to wake the instance)

## Tools
- **get_quote** — returns a random motivational quote.
- **get_crypto_price** — fetches the live USD price of any cryptocurrency (via CoinGecko).

## Two ways to run this server
- `server.js` — stdio transport, for local use with Claude Desktop or any MCP client that
  spawns a local process.
- `server-http.js` — StreamableHTTP transport wrapped in Express, for cloud/network deployment
  (this is what's running at the live demo URL above). Listens on `process.env.PORT`.

## Local setup
```
npm install
npm start          # runs server.js (stdio)
node server-http.js  # or run the HTTP version locally
```

## Try the live HTTP endpoint
```
curl -X POST https://mcp-first-server.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Tech
Node.js, [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk), Express,
Zod for schema validation. Deployed on Render.

## License
MIT — see [LICENSE](./LICENSE).

## Author
Built by James Ganobi.