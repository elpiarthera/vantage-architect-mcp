/**
 * MCP server factory — registers the 4 tools of @vantageos/mcp-architect.
 *
 * Real `Server` instance from `@modelcontextprotocol/sdk` is wired in `index.ts`.
 * This factory is consumed by both the stdio entry point and the integration
 * tests so they share the exact same tool surface.
 */
import { tool as decomposeSpec } from "./tools/decompose_spec.js";
import { tool as renderArchitecture } from "./tools/render_architecture.js";
import { tool as expandNode } from "./tools/expand_node.js";
import { tool as exportSpec } from "./tools/export_spec.js";

export const TOOLS = [
  decomposeSpec,
  renderArchitecture,
  expandNode,
  exportSpec,
] as const;

export type ArchitectTool = (typeof TOOLS)[number];

export interface VantageArchitectServer {
  readonly name: string;
  readonly version: string;
  readonly tools: typeof TOOLS;
}

export function createServer(): VantageArchitectServer {
  return {
    name: "vantage-architect-mcp",
    version: "1.0.0",
    tools: TOOLS,
  };
}

export function getTool(name: string): ArchitectTool | undefined {
  return TOOLS.find((t) => t.name === name);
}
