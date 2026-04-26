#!/usr/bin/env node
/**
 * Entry point — `@vantageos/mcp-architect`
 *
 * Boots the MCP server over stdio transport. The HTTP transport is opt-in
 * (env var `MCP_HTTP_PORT`) and used for the optional Railway remote-demo
 * deployment (Track C T6.C.9 — not auto-deployed).
 */
import { createServer, getTool, TOOLS } from "./server.js";

async function main(): Promise<void> {
  const server = createServer();

  // Wire @modelcontextprotocol/sdk only when the dependency is present at runtime.
  // This keeps unit tests fast and avoids hard-failing the entry point during
  // local development before `npm install`.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sdk: any = await import("@modelcontextprotocol/sdk/server/index.js").catch(
      () => null,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stdio: any = await import("@modelcontextprotocol/sdk/server/stdio.js").catch(
      () => null,
    );
    if (!sdk || !stdio) {
      throw new Error(
        "[vantage-architect] @modelcontextprotocol/sdk not installed — run `npm install` then retry.",
      );
    }

    const Server = sdk.Server;
    const StdioServerTransport = stdio.StdioServerTransport;

    const mcp = new Server(
      { name: server.name, version: server.version },
      {
        capabilities: { tools: {}, resources: {} },
        extensions: ["io.modelcontextprotocol/ui"],
      },
    );

    // Tools list handler.
    mcp.setRequestHandler(
      { method: "tools/list" },
      async () => ({
        tools: TOOLS.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      }),
    );

    // Tools call handler.
    mcp.setRequestHandler(
      { method: "tools/call" },
      async (req: { params: { name: string; arguments: unknown } }) => {
        const tool = getTool(req.params.name);
        if (!tool) throw new Error(`unknown tool: ${req.params.name}`);
        return tool.handler(req.params.arguments);
      },
    );

    const transport = new StdioServerTransport();
    await mcp.connect(transport);
    // eslint-disable-next-line no-console
    console.error(`[vantage-architect] ready (${TOOLS.length} tools)`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[vantage-architect] fatal:", err);
    process.exit(1);
  }
}

void main();
