# Merry Haven — Session Handover

**Purpose:** Bridge context between Claude Code sessions. Read this at the start of a fresh `/clear`'d session. It's the *current state* doc — what was just done, what's locked in, what's likely next. CLAUDE.md and DESIGN.md cover the timeless stuff; this file covers what changes per work session.

> Last updated: end of Round 11 (timeline 3-view + holo globe + T+5 clearing + /init setup)

---

## What just shipped (most recent → older)

1. **`/init` ran** — CLAUDE.md, CLAUDE.local.md, `.gitignore`, two skills (`/rebuild`, `/design-check`), CSS color-token hook (`.claude/hooks/check-css-colors.py` + `.claude/settings.local.json`). Hook needs a `/hooks` open or session restart to activate (settings.local.json didn't exist when the prior session started).
2. **T+5 launch clearing** in `useLaunches.js` — launches whose NET is more than 5 minutes in the past drop off the list. Filter re-evaluates every 30s. Affects every consumer of `useLaunches` (LaunchColumn list, T0 hero, ticker launch items if any, etc.).
3. **TIMELINE tab is a 3-view container** in `WeatherPanel` RANGE column. Sub-tabs persist to localStorage `mh-timeline-view`:
   - `TAPE` — horizontal timeline, 4-tier milestone stagger, smooth color/opacity-only hover (no size shifts).
   - `LIST` — vertical editorial list, never compresses.
   - `GLOBE` — holo globe via d3-geo orthographic, wireframe Earth + continent outlines, crimson pad marker + great-circle trajectory arc. Pad coords from `launch.pad.latitude/longitude`. Inclination inferred from `mission.orbit.abbrev` with Starlink name overrides in `ui/src/data/orbits.js`. Drag-to-rotate, RECENTER button.
4. **PADS tab** in RANGE — zoomable pad map (scroll-wheel zoom, click+drag pan). Crash-hardened: native non-passive wheel listener via `useEffect`, `isFinite` guards, viewport-width clamp 4–100, label-scale shrinks as you zoom.
5. **News-only ticker** — drops launch interleaving. First item is the `ON THIS DAY` almanac fact from `ui/src/data/onThisDay.js` (outlined crimson pill, not a link). News items are clickable links to source articles. Pause-on-hover dims siblings to 25%, hovered stays 100%.
6. **Masthead deleted** — entire top bar removed. The "fun fact" survived as the first ticker item.
7. **RANGE → 4 tabs** — FORECAST / RADAR / TIMELINE / PADS. Tab state persists to localStorage `mh-range-tab`.

---

## Hard-locked decisions (don't undo without asking)

These were debated and chosen on purpose. Treat as immutable unless the user explicitly raises them:

- **Brutalist art-poster.** See `DESIGN.md`. Reread §7 Don'ts before any visual change.
- **Cinematic mode is named `Countdown View`**, not "Ignition Mode". Class names `countdown-view__*`. Phase label `COUNTDOWN`.
- **Dismiss copy is always `CLOSE ✕`.** No DISMISS, BACK, EXIT, MIN, HIDE, `[ – ]`.
- **No top bar / no masthead.** It got built and rejected as too much vertical chrome.
- **PadMap lives in RANGE/PADS tab only**, not in the launch column. Earlier placement stole space from launches.
- **Ticker is news-only.** Launch info is already in the T0 hero and the column list.
- **News items use solid crimson source pills.** Almanac item uses an outlined crimson pill to distinguish.
- **Countdown View at T-1m to T+30s** (was T-30s, expanded after user feedback). Stream takes 2/3 of viewport, HUD on right 1/3. Stream pane has a black scrim that fades out over 1.2s to mask iframe autoplay-pop.
- **Countdown digits color bands**: green T-60→45s, yellow T-45→30s, red T-30→0. No blinking ever.
- **Editorial spread layout for LaunchDetail** — ISSUE NO. masthead, drop-cap description, footnotes. Don't replace with cards.

---

## Architecture quick map (use when adding things)

- **3 UI modes** are gated by `useLaunchWatch`: returns `{ launchMode, countdownMode, activeLaunch, dismiss, dismissCountdown }`. Countdown supersedes Launch mode.
- **Status pulse** comes from `useStatusChanges` — set of launch ids whose `.status.abbrev` flipped since last fetch. Lives ~4.5s, drives `.is-changed` on launch list items.
- **Filtered launches** come from `useLaunches` — T+5 clear filter applied via `useMemo`.
- **News + almanac** in `NewsTicker.jsx` + `useNews.js` + `data/onThisDay.js`. Spaceflight News API proxied at `/api/news` (10-min cache server-side).
- **Trajectory data** in `data/trajectories.js` (per-rocket milestone arrays). `data/orbits.js` has inclination mapping + `greatCircle()` math.
- **Pad coords + inclination** for the globe view come straight from LL2 (`pad.latitude/longitude`) and `mission.orbit.abbrev` + name regex overrides.

---

## Currently underspecified / likely next asks

Things the user has mentioned or that feel close to landing — possible next-session topics:

- **Globe milestone markers along the trajectory arc.** Each milestone in `trajectories.js` has a T+time. Could compute a position along the great-circle proportional to time (very rough — true downrange varies). Would need a way to read total ascent duration from data.
- **Multiple launch sites on the globe.** Currently only the selected launch's pad is highlighted. Could show all upcoming pads (KSC, Starbase, VSFB) with the selected one bright and others dim.
- **Auto-rotate the globe** as ambient motion (slow, optional, toggleable).
- **Real telemetry post-launch** — they declined SGP4 propagation when offered earlier, but it stays on the table.
- **Verify Countdown View animations end-to-end** with `/plugin install playwright@claude-plugins-official` — would let Claude visually verify changes against DESIGN.md.

---

## Open environment notes

- No git repo (no `.git/`). User may want `git init` + first commit before more substantial work. They were aware as of /init.
- No tests, no linter, no formatter — by design. Don't add without asking.
- No GitHub CLI installed. Don't suggest `gh` workflows.
- The hook (`.claude/settings.local.json`) won't fire in a session that started before it was created. Either open `/hooks` once or restart.

---

## How a fresh session should start

1. CLAUDE.md auto-loads. Skim it.
2. Read this file (`.claude/HANDOVER.md`) for current state and locked decisions.
3. If the user is mid-task, ask "where did we leave off?" — don't assume.
4. If touching anything visual, reread `DESIGN.md` §7 Don'ts first.
5. For multi-step work, set up tasks before starting.
6. Standard delivery is still `podman compose down && podman compose up --build -d` (or use the `/rebuild` skill).
