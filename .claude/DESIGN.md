# Merry Haven — Design Language

**Brutalist Art-Poster.** Pure black + crimson + Bebas Neue + Inter + JetBrains Mono. Nothing pretends to be a dashboard. Big type contrasts. Single accent color. No chrome.

If you're about to add a card border, a glow, a box-drawing character, a gradient, an icon, or a `[BRACKETED]` label — stop. Reread this document.

---

## 1. Palette

All colors are CSS custom properties defined in `:root` (see `ui/src/styles/index.css`).

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#000000` | Pure black background |
| `--panel` | `#000000` | Panel background (same as bg) |
| `--card` | `#000000` | Card background (same as bg) |
| `--border` | `rgba(255,255,255,0.08)` | Hairline divider between sections |
| `--border2` | `rgba(255,255,255,0.18)` | Visible border (modal frame) |
| `--text` | `#ffffff` | Primary text |
| `--bright` | `#ffffff` | Same as text — for emphasis cases |
| `--dim` | `#888888` | Secondary text, mono labels |
| `--dimmer` | `#555555` | Tertiary text, watermarks |
| `--accent` | `#e63946` | **THE ONLY accent color.** Status, links, active states, dividers, calls to action. |

Aliased status tokens (`--green`, `--red`, `--cyan`, etc.) all resolve to `--accent`. There is one screaming color, not many.

### Special: Countdown View bands (only place non-palette colors are allowed)

| Token | Hex | Range |
|---|---|---|
| Band — green | `#00ff66` | T-60s → T-45s |
| Band — yellow | `#ffcc00` | T-45s → T-30s |
| Band — red | `#ff2233` | T-30s → T-0 |

These are ops-control colors (GO / CAUTION / HOLD) and only appear inside the countdown view's massive timer digits.

---

## 2. Typography

Three fonts, distinct roles. **Do not cross-use** (e.g., never set a mono label in Bebas).

| Token | Family | Role |
|---|---|---|
| `--font-display` | `'Bebas Neue', Impact, 'Arial Narrow Bold', sans-serif` | Numbers, mission names, section headlines, tab labels, status badges, big buttons |
| `--font-mono` | `'JetBrains Mono', 'Consolas', monospace` | Small uppercase labels, timestamps, technical strings, footnotes, dismiss/close buttons |
| `--font-body` | `'Inter', system-ui, sans-serif` | Body copy, mission descriptions |

### Size scale

| Tier | Size | Use |
|---|---|---|
| Hero | **180px** | Countdown View timer digits |
| Display 1 | **96px** | Launch-mode (T-10m expanded) mission name |
| Display 2 | **72px** | T0 hero countdown in launch column |
| Display 3 | **64px** | Editorial spread headline, Countdown View mission name |
| Display 4 | **56px** | Launch-detail name (non-editorial) |
| Display 5 | **38px** | Logo (`MERRY HAVEN`), Countdown View phase label |
| Display 6 | **32px** | LaunchExpanded provider/status, settings modal title |
| Display 7 | **28px** | Panel headers (`RANGE`), Countdown View pad |
| Display 8 | **22px** | Tab labels, T0 hero mission name, large badges, weather wind dir |
| Display 9 | **18px** | News-ticker text, editorial specs, button copy |
| Display 10 | **16px** | Default badges |
| Mono | **10–13px** | Labels with `letter-spacing: 0.18em`, `text-transform: uppercase` |
| Body | **13–14px** | Inter, `line-height: 1.5–1.6` |

### Letter-spacing rules

- Mono labels: **`0.18em`** standard. Always uppercase.
- Bebas display: **`0.01–0.04em`**.
- Large numbers (countdown): **`-0.01em` to `-0.02em`** to tighten optical spacing.
- Ticker mono pill: `0.14em` (intentionally tighter inside the pill).

---

## 3. Spacing

Base unit: **4px**. Use multiples: 4, 8, 12, 16, 20, 24, 28, 36px.

| Pattern | Value |
|---|---|
| Column horizontal padding | `20px` |
| Section vertical gap | `16–24px` |
| Related-item gap | `4–10px` |
| Modal inner padding | `24px 28px` |
| Modal width | `480px` |
| Standard line height | `0.85–1` for display, `1.5–1.6` for body |

---

## 4. Components

### Buttons

**Primary action (CTA)** — solid crimson rectangle, black text, Bebas Neue:
```css
background: var(--accent);
color: var(--bg);
font-family: var(--font-display);
font-size: 20-22px;
letter-spacing: 0.04em;
padding: 14px 18px;
```
Examples: `OPEN SLD-45 WEATHER FORECAST`, `TEST COUNTDOWN VIEW`.

**Secondary / dismissal** — mono, dim, no background, no border:
```css
font-family: var(--font-mono);
font-size: 11-12px;
font-weight: 500;
letter-spacing: 0.18em;
color: var(--dim);
text-transform: uppercase;
```
Examples: `CLOSE ✕`, `MIN`, `[ – ]`. Hover → `var(--accent)`.

### Section labels

Always: mono, 10px, `letter-spacing: 0.18em`, uppercase, `var(--dim)` color. No `◈`, no `──`, no decoration. Plain text only:

✅ `RADAR / KMLB`
✅ `LAUNCH FORECAST / SLD-45`
❌ `◈ RADAR · KMLB`
❌ `── HOURLY FORECAST ──`

### Badges

Bebas Neue, no border, no background, plain text in `var(--accent)`:

✅ `GO`
✅ `HOLD`
✅ `TBD`
❌ `[GO]`
❌ `[ HOLD ]`

Size: default 16px, `--lg` modifier 22px.

### Modal / overlay

- Overlay: `rgba(0,0,0,0.82)` full-screen, z-index 100, clicking outside closes
- Modal: `480px` wide, `1px solid var(--border2)`, `var(--bg)` background, `24px 28px` padding
- Header: title in 32px Bebas + secondary `CLOSE ✕` button right-aligned

### Tabs

Bebas, 22px, `letter-spacing: 0.04em`, `28px gap`. Active: `var(--accent)` color + 2px `var(--accent)` `border-bottom`. Inactive: `var(--dim)`.

### Panels & columns

- Background: `var(--bg)` (pure black)
- Hairline dividers between sections: `1px solid var(--border)`
- **No corner brackets, no card backgrounds, no shadows.**

### Mission patch

When rendered: `object-fit: contain`, `max-height` constrains it (240px in detail panel, 90px in editorial inset). Never crop or distort.

---

## 5. Naming & copy conventions

### Button copy

| Action | Always use | Never use |
|---|---|---|
| Close, dismiss, or collapse anything (panel, modal, detail view, range column) | `CLOSE ✕` | DISMISS, BACK, EXIT, MIN, HIDE, COLLAPSE, `[ – ]`, ×, bare ✕ |
| Test variant of a feature | `TEST {NAME}` | DEMO, PREVIEW, TRY |
| Primary action | All-caps Bebas, plain words ending in optional arrow `→` | Action words in mono |

### Phase / mode names

| Concept | Display name |
|---|---|
| Cinematic T-1m takeover | **Countdown View** (phase label: `COUNTDOWN`) |
| T-10m expanded launch | **Launch Mode** (no on-screen label) |
| Normal three-column app | **Normal Mode** (no on-screen label) |

### Time formatting

- Countdown: `T-HH:MM:SS` (with `T-` or `T+` prefix). Always `MM:SS`, zero-padded.
- Observation timestamp: `OBS HH:MM` (mono, dim)
- NET (No Earlier Than): `MMM D, YYYY HH:MM TZ` via `toLocaleString`
- Relative day: `TODAY`, `TOMORROW`, `IN Xd`, `T-XXH XXM`

### Section labels

Always uppercase mono. Two acceptable forms:
- Plain word: `RANGE`, `FORECAST`, `HOURLY`, `BOOSTER`
- Two related concepts joined by `/`: `RADAR / KMLB`, `LIVE / SPACE COAST`, `LAUNCH FORECAST / SLD-45`

Never `·`, `—`, or `◈` as a separator.

---

## 6. Animation

| Pattern | Duration | Easing |
|---|---|---|
| Standard fade (overlay, modal, normal-mode swap) | `0.5s` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Width transition (range collapse, detail slide-in) | `0.3–0.35s` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Color band transitions on big numbers | `0.5s` | `ease-in-out` |
| Hover color transitions | `0.1s` | `ease` (default) |
| Wind arrow rotation | `0.8s` | `ease` |
| Status badge pulse (`flight`) | `1.2s` | `ease-in-out` infinite |
| Countdown View entrance — stream pane | `0.5s` opacity | `ease-out` |
| Countdown View entrance — HUD slide | `0.5s` translateX 80→0 | `cubic-bezier(0.16, 1, 0.3, 1)` (decel) |

**No blinking, no flashing.** Color/opacity transitions only.

---

## 7. Don'ts (anti-patterns)

These all make Merry Haven look like a TUI or a Grafana clone. They are banned.

- ❌ Box-drawing characters: `┌`, `┐`, `└`, `┘`, `─`, `│`, `█`, `░`
- ❌ Bracketed labels: `[GO]`, `[ x ]`, `[NEXT]`, `[ SETTINGS ]`
- ❌ Decorative glyphs: `◈`, `❦`, `❧`, `※`, `✦`, `★`, `✠`
- ❌ HUD corner brackets on panels
- ❌ Text glows (`text-shadow` for emphasis) — except optional `drop-shadow` filter on the (currently unused) logo SVG
- ❌ Card backgrounds on stat tiles (no `background: var(--card); border: 1px solid var(--border)`)
- ❌ Gradients (except the band-color transitions, which are CSS `transition` not `background: linear-gradient`)
- ❌ Iconography (use text labels, not symbols, except `✕` for close, `→` for links, `↑` for the wind arrow)
- ❌ Multiple accent colors (only `var(--accent)`, plus the three countdown bands)
- ❌ Blinking, flashing, or step animations
- ❌ Rounded corners (`border-radius` never > 0)

---

## 8. File-level references

| Concept | File |
|---|---|
| Tokens | `ui/src/styles/index.css` (`:root` block at top) |
| Component patterns (all rules) | `ui/src/styles/index.css` |
| Layout shell | `ui/src/App.jsx` |
| Brand mark | `ui/src/components/Logo.jsx` |
| Three-column layout | `App.jsx` → `LaunchColumn` / `CenterPanel` / `WeatherPanel` |
| Cinematic takeover | `ui/src/components/CountdownView.jsx` |
| Editorial spread | `ui/src/components/LaunchDetail.jsx` |
| Settings modal | `ui/src/components/SettingsMenu.jsx` |
| News ticker | `ui/src/components/NewsTicker.jsx` + `ui/src/hooks/useNews.js` |
| Site definitions | `ui/src/data/sites.js` |
| Site-aware API | `api/server.js` (`/api/weather?station=&lat=&lon=`) |
| Site-aware weather hook | `ui/src/hooks/useWeather.js` |

---

## 9. Multi-site model (Space Coast / Starbase / Vandenberg)

The range panel and stream picker are **site-aware**. A site is defined in `ui/src/data/sites.js` with its coords, NWS station, stream id, radar lat/lon, pad layout, and pad-name match terms.

### State model

- `activeSite` lives in `App.jsx`, computed as `siteOverride ?? getSiteForLaunch(displayLaunch)`.
- `siteOverride` is set when the user clicks a site tab in the range panel or a launch-site-mapped stream tab in the center panel.
- `siteOverride` **resets to `null` every time `selectedId` changes** (i.e. when the user clicks a different launch in the list). The override is intentionally transient.

### What follows the active site

| Component | Effect |
|---|---|
| `WeatherPanel` (forecast/radar/timeline/pads) | Pulls NWS observations + forecast for the site's station + coords |
| `RadarMap` | Windy iframe centers on the site's `radarLat` / `radarLon` |
| `PadMap` | Renders the site's `pads`, `siteLabels`, and `coastline` |
| `CenterPanel` stream | Auto-selects the site's `streamId` |
| `CountdownView` stream | Same — `streamForLaunch(launch)` resolves through `getSiteForLaunch` |
| SLD-45 forecast button | Only renders when `site.id === 'spacecoast'` |

### What does **not** follow the active site

- **The launch list and T-0 hero are global.** The hero always shows the absolute next launch in America. The list shows all upcoming launches across all sites — filtering by site is intentionally not done.
- **`StreamEmbed` (launch mode)** uses the launch's actual `vid_urls` from LL2, not the site stream. Launch-specific webcasts trump site defaults.

### Site tabs

A row of clickable tabs above the existing FORECAST/RADAR/TIMELINE/PADS sub-tabs in the range panel. Tabs are full-width-divided, mono 10px, `letter-spacing: 0.22em`, uppercase. Active tab: `var(--accent)` text + faint accent tint background.

### Stream ↔ site sync

The sync is bidirectional but asymmetric:
- Picking a **site tab** auto-selects that site's stream.
- Picking a **stream tab that maps to a site** (Space Coast or Starbase) also flips the active site (via `onSelectSite`).
- The McGregor stream does **not** map to a site — picking it changes the stream only. It's an engine-test feed, not a range.

### Fallbacks

- A launch whose pad/location doesn't match any site → falls back to Space Coast.
- A site with no dedicated stream (Vandenberg) → falls back to the Space Coast stream feed. The Vandenberg tab is **never** included in the stream picker.

---

## 10. No-scroll layout discipline

The Corsair Xeneon Edge is a hard-locked **2560×720** that lives on a wall **24/7**. This is a glanceable launch-ops display, not a desktop app — the user is not at a keyboard, will not be expected to scroll, and will rarely interact. Everything readable at any moment must fit on screen at that moment.

**No surface ever scrolls.** Not via wheel, not via touch, not via keyboard. Anything that doesn't fit is either restructured to fit or capped to the number of items that do.

### Rules

- `.app` is `height: var(--display-h); overflow: hidden`. No exceptions.
- Every column constrains its content to fit. Use `overflow: hidden` on the column root, not `overflow: auto`.
- **Cap list counts, don't clip items.** If 5 of 12 launches fit in the available space, render only 5. Truncating items mid-height is unreadable. `launches.slice(1, N)` with N chosen so items render at their natural height is the pattern, not `overflow: hidden` on a long list.
- Hero blocks get explicit `max-height` so they can't grow if content varies (long mission names, extra metadata, etc.). The intent of the cap is to make the column predictable, not to clip the hero itself.
- Modal `max-height: 640px` with `overflow-y: auto` is the **only** allowed scrollable surface, and only because it's a transient interaction surface that's hidden by default.
- **T-minus clocks are always single line.** Digits use `font-variant-numeric: tabular-nums` (uniform width, no jitter) and the wrapping span is `white-space: nowrap`. If the clock's row threatens to overflow (long pad name next to a 9-hour countdown), the clock font-size scales down via `clamp()` + container queries — never wraps, never truncates. See `.editorial__clock` for the canonical implementation.

### Fixed-height components

| Component | Constraint |
|---|---|
| `.launch-col` | `height: 100%; max-height: var(--display-h)` |
| `.launch-col .mh-logo` | `max-height: 80px` |
| `.launch-col__t0-hero` | `max-height: 165px` |
| `.launch-col__list` | Renders `launches.slice(1, 5)` — at most 4 items, sized at ~86px each so all are fully readable |
| `.launch-col__item` | `padding: 9px 20px`, `.launch-col__name` at 19px |
| `.launch-detail-col` | `width: 440px`, body `overflow: hidden` |
| `.weather-col` | `width: 760px`, body `overflow: hidden` |
| `.editorial__body` | Content sized to fit `~680px` with no scroll — patch 140px hero, headline 36px, lede clamped to 2 lines, footnotes folded into specs grid |
| `.weather-panel__body` | `overflow: hidden`; radar and pads tabs wrap their content in a `flex: 1; min-height: 0` fill div so their SVGs/iframes stretch |

### When adding new content

If a new element doesn't fit, the answer is **never** "add a scrollbar." It's either: shrink the element, restructure to use less space, or accept that less of the content is visible. The discipline is the design.

---

## 11. Countdown escalation tiers

Every `CountdownClock` instance derives a tier from the remaining milliseconds and renders `countdown countdown--<tier>` so any clock anywhere intensifies as the launch approaches. Progression is intentionally calm above T-15m and only goes red at T-1m — the wall display should not look frantic four hours out.

| Tier | When | Visual |
|---|---|---|
| `far` | > T-1h | `var(--text)` — default, neutral |
| `approaching` | T-15m → T-1h | `var(--text)` — same; the only signal is the ticking digits |
| `imminent` | T-5m → T-15m | `var(--bright)` + `font-weight: 500` — brightens |
| `critical` | T-1m → T-5m | `var(--bright)` + `font-weight: 600` + tighter letter-spacing — visibly tense |
| `urgent` | T-0 → T-1m | `var(--accent)` (crimson) |
| `launched` | T+ (post-NET) | `var(--accent)` (crimson) |

The launch column hero block (`.launch-col__t0-hero`) reads its child clock's tier via CSS `:has()` and adopts the accent left-border + tint background once the clock crosses `imminent` (T-15m) or beyond, regardless of whether the user has explicitly selected another launch. This guarantees the wall shouts when a launch is genuinely close, not just when someone happens to be clicking around.

Do not introduce more tiers. Six is the discipline. If you need more nuance, encode it elsewhere (status badge, banner) — not by fragmenting this scale.

---

## 12. 24/7 operation

The display lives on a wall and runs continuously. Two patterns address that.

### Nightly dim mode

`useDimMode()` returns `true` when local clock is between **22:00 and 06:00**. App root toggles `.app--dim`, which applies `filter: brightness(0.4)` with an `8s ease` transition (slow enough that someone walking in at 22:01 doesn't notice a flash).

**Use `filter: brightness()`, never `opacity`.** On OLED, lowering opacity blends the source pixel with the background — the LED still emits at full power. `filter: brightness()` actually reduces emission, which is what you need for burn-in mitigation.

### Status-change top banner

When `useStatusChanges` detects a launch's `status.abbrev` flipping (Go → Hold, TBD → Go, etc.), it emits a `latestEvent` object. `<StatusBanner>` slides down from the top of the main area, showing `STATUS CHANGE — <mission> — FROM → TO`, and auto-dismisses after **30 seconds**. The banner is `position: absolute; z-index: 50` over the main area so it does not reshuffle the layout; the row-level pulse on the launch list continues to fire independently (4.5s).

Banner colors: solid `var(--accent)` background, `var(--bg)` text — same scheme as the primary CTA button. There is exactly one banner at a time; if multiple flips happen in one fetch tick, only the most recent renders. (Earlier flips are still pulsed in the row list, so they are not silently lost.)

---

## 13. Crewed launches

For any launch where `launch.rocket.configuration.human_rated === true` or `launch.mission.type === 'Human Exploration'`, the editorial detail panel renders an inline `CREWED` badge at the top of the body (above the patch hero). The badge is solid `var(--accent)` background with `var(--bg)` text in 22px Bebas — visually equivalent to the primary CTA but content-width via `align-self: flex-start`.

A crew roster (`launch.mission.crew` when LL2 returns it) optionally renders inline beside the label. Roster is "nice to have" — when absent, the badge alone signals the mission's stakes.

Crewed launches are the highest-stakes events on the calendar. The single CREWED chip is the loudest visual cue any launch gets short of a status-change banner.

---

## 14. When adding something new

Before writing any JSX/CSS:

1. Does the new thing fit an existing component pattern (button, badge, section label, modal, tab)? Reuse the exact classes.
2. If genuinely new, name the BEM-style class `merryhaven-component-name__element` and add it to `index.css` in the relevant section.
3. Pick the right font from the three tokens. Pick the right size from the scale.
4. Pick `var(--accent)` for the one accent moment. Use `var(--dim)` for everything secondary.
5. If you're adding a button: is it primary or secondary? Match the spec.
6. If you're adding copy: is it a CLOSE button? Use `CLOSE ✕` exactly.
7. Read `## 7. Don'ts` one more time. Then ship.
