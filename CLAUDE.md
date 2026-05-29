# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Merry Haven is a launch-ops dashboard for the Corsair Xeneon Edge, a hard-locked **2560×720** ultrawide touchscreen. It's a monorepo with two services:

- `api/` — minimal Node 20 + Express server proxying LL2 launches, NWS weather, and Spaceflight News.
- `ui/` — React 18 + Vite 5 SPA served by nginx.

Everything runs via Podman Compose. There is no test suite, no linter, no formatter, no env vars, and no CI.

## DESIGN.md is the source of truth

Read `DESIGN.md` before any visual change. The aesthetic is **brutalist art-poster** and is non-negotiable. The five rules that get broken most:

1. **No TUI / Grafana / dashboard aesthetics.** Every regression has been into that look. If a change starts feeling like a dashboard, it is wrong.
2. **No box-brackets or ornaments in copy.** `[GO]`, `◈ SECTION`, `── HOURLY ──`, etc. are banned. Plain text only.
3. **No colors outside the `:root` token block.** Every color in CSS must be a `var(--...)`. Direct hex/rgb/hsl literals outside `ui/src/styles/index.css`'s `:root` are banned.
4. **One accent color.** `--accent` (#e63946 crimson) is it. The only exceptions are the three Countdown View band colors (green/yellow/red), used nowhere else.
5. **Confirm before destructive layout changes.** Major restructuring (renaming components, deleting features, restructuring App.jsx, etc.) goes through plan mode first.

## Rebuild loop

Every code change is delivered through the container rebuild:

```
podman compose down && podman compose up --build -d
```

Run from the project root. This is the canonical workflow for both `api/` and `ui/` changes — no separate dev-server step. Nothing is run via `npm run dev` directly.

App serves at `http://localhost:8080`.

## Architecture quick map

- **3 UI modes**, switched by `useLaunchWatch`:
  - **Normal** (`App.__normal-mode`): 3 columns — LaunchColumn | CenterPanel (stream) | WeatherPanel.
  - **Launch Mode** (T-10m): 2 columns — LaunchExpanded | StreamEmbed, animated widths via Framer Motion.
  - **Countdown View** (T-1m → T+30s): cinematic full takeover, stream on left + HUD on right.
- **API caching** lives in `api/server.js` as an in-memory `Map`. TTLs: launches 5m, weather 15m, news 10m. No persistence — restart clears it.
- **CSS tokens** live in `ui/src/styles/index.css` `:root`. All component classes follow BEM-like `block__element--modifier`.
- **The viewport is hardcoded** at 2560 in `ui/index.html`'s `<meta name="viewport">`. Don't make responsive changes unless explicitly asked — the target device is fixed hardware.

## When making UI changes

- Read `DESIGN.md` first. Reread §7 Don'ts before shipping.
- Add CSS rules in the appropriate `─── Section ───` block in `ui/src/styles/index.css`, not in component files.
- Buttons that close anything say exactly `CLOSE ✕`. There is no "DISMISS", "BACK", or `[ – ]`.
- New big-type goes in `var(--font-display)` (Bebas Neue). Small labels go in `var(--font-mono)` with `letter-spacing: 0.18em` and `text-transform: uppercase`. Body copy uses `var(--font-body)` (Inter). Never cross-use.
