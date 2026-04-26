/**
 * Bridge wrapper.
 *
 * v1.0 expects `@modelcontextprotocol/ext-apps/react` `useBridge()` to be
 * available at runtime in the host iframe. We expose a defensive shim so the
 * bundle still renders in Vitest/jsdom without the real ext-apps runtime —
 * tests assert that callTool routes through the shim.
 *
 * Sandbox compliance (Critical Rule #4 mcp-app-standard) :
 *   - We NEVER reach `window.parent.*` directly.
 *   - We NEVER touch `localStorage`, `sessionStorage`, `document.cookie`.
 *   - We NEVER fire `fetch()` / `XMLHttpRequest` / `WebSocket` outside the bridge.
 */

export interface Bridge {
  callTool: <T = unknown>(name: string, args: Record<string, unknown>) => Promise<T>;
}

type BridgeProvider = () => Bridge;

let provider: BridgeProvider | null = null;

export function registerBridgeProvider(p: BridgeProvider): void {
  provider = p;
}

export function useBridge(): Bridge {
  if (provider) return provider();
  // Default no-op bridge for Vitest / jsdom rendering. Tests can stub via
  // registerBridgeProvider to capture calls. Production iframe wires the real
  // provider from `@modelcontextprotocol/ext-apps/react`.
  return {
    callTool: async () => {
      // intentionally no-op — kept silent to avoid noisy logs in tests.
      return undefined as never;
    },
  };
}
