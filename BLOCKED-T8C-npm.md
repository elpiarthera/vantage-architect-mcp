# BLOCKED — T8.C npm publish

**Date** : 2026-04-26 (UTC)
**Step** : `npm publish --access public` for `@vantage/mcp-architect@1.0.0`
**Logged user** : `elpivantage`

## Error (verbatim)

```
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/@vantage%2fmcp-architect - Not found
npm error 404
npm error 404  '@vantage/mcp-architect@1.0.0' is not in this registry.
```

The `404 Not Found` on first publish to a scope is the canonical npm signal that the **publisher does not have rights on the `@vantage` scope**. Confirmed via `npm org ls vantage` → `403 Forbidden`.

## Diagnosis

The `@vantage` npm scope is **not owned by the `elpivantage` account** (or by any org `elpivantage` belongs to). Two possibilities :

1. `@vantage` is owned by a third party (squatted or held by another org).
2. `@vantage` was never registered and needs to be created — but creating a scoped org costs money on npm and requires explicit org admin action.

## Suggested unblock (Pi / Laurent decision)

Pick one :

- **Option A — rename to `@elpi-corp/mcp-architect`** : `elpivantage` likely owns / can create the `@elpi-corp` org. Update `package.json#name` + bin entries, retag, republish. Lowest friction. **RECOMMENDED**.
- **Option B — rename to `@elpivantage/mcp-architect`** : guaranteed to work (user scope of the logged-in account). No org creation needed. Fastest.
- **Option C — claim `@vantage` org on npm** : requires npmjs.com signup + paid org or proof of trademark. Weeks-scale effort.
- **Option D — publish unscoped as `vantage-mcp-architect`** : already a name reservation risk; check availability first.

## Status

GitHub release `v1.0.0` is **already shipped** (https://github.com/elpiarthera/vantage-architect-mcp/releases/tag/v1.0.0). Users can install via `npm i github:elpiarthera/vantage-architect-mcp` while npm canal is unblocked.

VantageRegistry plugin upsert proceeds independently of npm.

---

Built by: mcp-publisher (via gamma) | bu-mcp BU | 2026-04-26
