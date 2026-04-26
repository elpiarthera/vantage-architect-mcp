# BLOCKED — T8.C Railway deploy DEV

**Date** : 2026-04-26 (UTC)
**Step** : Railway deploy DEV for `vantage-architect` Phase 1.

## Reason

Railway CLI is **not installed locally** on this VPS :

```
$ railway --version
/bin/bash: railway: command not found
```

## Decision

Per Pi Day 51 PM directive : *"Si Railway problem : skip Phase 1 (stdio only), Phase 2 Q4 2026 reactivate"*.

`v1.0.0` ships **stdio-only** (Phase 1). Remote MCP App demo via Railway is **deferred to Phase 2 (Q4 2026)**.

`railway.json` (RAILPACK config) is committed in repo root and is ready for future activation — no code change required, only CLI install + `railway up`.

## Hard rule respected

I **did not** install the Railway CLI without authorization. Pi / Laurent must authorize that separately.

## To reactivate (Phase 2 Q4 2026)

```bash
# Authorized human runs :
curl -fsSL https://railway.com/install.sh | sh
railway login
cd /root/coding/vantage-architect-mcp
railway link
railway up
```

---

Built by: mcp-publisher (via gamma) | bu-mcp BU | 2026-04-26
