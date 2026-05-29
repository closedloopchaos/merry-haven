---
name: rebuild
description: Use when the user asks to rebuild, restart, ship, or deploy Merry Haven — runs the canonical podman compose rebuild loop and reports whether it came up clean.
---

# Rebuild Merry Haven

Run the canonical rebuild sequence from the repo root:

```
podman compose down && podman compose up --build -d
```

Notes for executing this skill:

1. Use the `PowerShell` tool with `cd "C:\Code\merry-haven"` chained with the rebuild command via `;`. Podman's stderr noise about the external compose provider is normal — do not flag it as an error unless the exit code is non-zero or the build fails.
2. After the build prints the Vite output (`✓ NNN modules transformed`, sizes, `built in ...`) and the two container ids/names appear, the rebuild succeeded. The app serves at `http://localhost:8080`.
3. If `npm install` actually ran (no cached layer), call that out — it usually means `ui/package.json` changed.
4. Report concisely: build status, the JS/CSS bundle sizes from Vite output, and any new module count delta. Do not paste the entire podman stderr.

This skill exists because the rebuild is the only delivery path — there's no `npm run dev` workflow for this project.
