#!/usr/bin/env python3
"""Merry Haven color-token guard hook.

Reads PostToolUse JSON on stdin (Write/Edit events) and scans the just-written
content for hex literals outside the project's whitelist. Emits a systemMessage
when something looks like a token-rule violation. Soft warning only — never blocks.

Whitelist:
- #000 / #000000 (pure black — universal)
- #fff / #ffffff (pure white — universal)
- #00ff66, #ffcc00, #ff2233 (the three documented countdown band colors)

Everything else outside of var(--token) is a violation per DESIGN.md.
"""
import json
import os
import re
import sys

ALLOWED = {"#000", "#000000", "#fff", "#ffffff", "#00ff66", "#ffcc00", "#ff2233"}
SCAN_EXTS = (".css", ".jsx", ".js")
HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")

try:
    payload = json.load(sys.stdin)
except Exception:
    sys.exit(0)

tool_input = payload.get("tool_input") or {}
fp = (tool_input.get("file_path") or "").replace("\\", "/")
if not fp.lower().endswith(SCAN_EXTS):
    sys.exit(0)

# Edit uses new_string; Write uses content. Either way we want what just got written.
content = tool_input.get("new_string") or tool_input.get("content") or ""
if not content:
    sys.exit(0)

hits = []
seen = set()
for m in HEX.findall(content):
    lower = m.lower()
    if lower in ALLOWED:
        continue
    if lower in seen:
        continue
    seen.add(lower)
    hits.append(m)

if hits:
    basename = os.path.basename(fp)
    plural = "s" if len(hits) > 1 else ""
    msg = (
        f"⚠ DESIGN.md: color literal{plural} in {basename}: "
        f"{', '.join(hits)} — use var(--accent) or a :root token."
    )
    print(json.dumps({"systemMessage": msg}))
