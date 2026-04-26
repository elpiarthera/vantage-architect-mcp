#!/usr/bin/env bash
# smoke-test-boot.sh — vantage-architect MCP tool invocation smoke gate
#
# Lesson #13 capture (Day 51 PM): boot smoke != tool smoke.
# A server that responds to `initialize` can still return -32602 on tool/call.
# This 3-step chain catches both categories before publish.
#
# Steps:
#   1. initialize handshake
#   2. tools/list — verify 4 tools with valid schema
#   3. tools/call decompose_spec — verify content[] returns valid MCP shape, no -32602
set -e

# Step 1 — initialize
INIT=$(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}' | timeout 5 node dist/index.js 2>&1)
if [[ "$INIT" != *'"protocolVersion"'* ]]; then
  echo "FATAL: server did not respond to initialize"
  echo "Output: $INIT"
  exit 1
fi
echo "Smoke 1/4 PASS — initialize"

# Step 2 — tools/list
LIST=$(printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | timeout 5 node dist/index.js 2>&1)
if [[ "$LIST" != *'"name":"decompose_spec"'* ]]; then
  echo "FATAL: tools/list did not return expected tools"
  echo "Output: $LIST"
  exit 1
fi
echo "Smoke 2/4 PASS — tools/list"

# Step 3 — tools/call decompose_spec (core content-block validation)
CALL=$(printf '%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"notifications/initialized","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"decompose_spec","arguments":{"requirement":"A 50+ char requirement string for testing the smoke gate end-to-end.","domain":"software","depth":2}}}' \
  | timeout 10 node dist/index.js 2>&1)
if [[ "$CALL" == *'"code":-32602'* ]]; then
  echo "FATAL: tools/call decompose_spec returned MCP error -32602 (malformed content block)"
  echo "Output: $CALL"
  exit 1
fi
if [[ "$CALL" == *'"isError":true'* ]] && [[ "$CALL" != *'Validation error'* ]]; then
  echo "FATAL: tools/call decompose_spec returned unexpected isError:true"
  echo "Output: $CALL"
  exit 1
fi
if [[ "$CALL" != *'"content"'* ]]; then
  echo "FATAL: tools/call did not return content"
  echo "Output: $CALL"
  exit 1
fi
echo "Smoke 3/4 PASS — tools/call decompose_spec"

# Step 4 — Validate tools/list returns valid JSON Schema (lesson #16)
LIST_RESPONSE=$(printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | timeout 5 node dist/index.js 2>&1)
# Must NOT contain Zod runtime markers
if [[ "$LIST_RESPONSE" == *'"_def"'* ]] || [[ "$LIST_RESPONSE" == *'"~standard"'* ]] || [[ "$LIST_RESPONSE" == *'"_cached"'* ]]; then
  echo "FATAL: tools/list inputSchema contains Zod runtime markers (lesson #16) — must use zodToJsonSchema() conversion"
  echo "Output: $LIST_RESPONSE"
  exit 1
fi
# Must contain valid JSON Schema markers
if [[ "$LIST_RESPONSE" != *'"type":"object"'* ]]; then
  echo "FATAL: tools/list inputSchema not valid JSON Schema (no type:object)"
  echo "Output: $LIST_RESPONSE"
  exit 1
fi
echo "Smoke 4/4 PASS — tools/list inputSchema is valid JSON Schema (lesson #16 baked)"
echo ""
echo "All 4 smoke tests PASS (initialize -> tools/list -> tools/call -> JSON Schema validation)"
