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

---

## 9. When adding something new

Before writing any JSX/CSS:

1. Does the new thing fit an existing component pattern (button, badge, section label, modal, tab)? Reuse the exact classes.
2. If genuinely new, name the BEM-style class `merryhaven-component-name__element` and add it to `index.css` in the relevant section.
3. Pick the right font from the three tokens. Pick the right size from the scale.
4. Pick `var(--accent)` for the one accent moment. Use `var(--dim)` for everything secondary.
5. If you're adding a button: is it primary or secondary? Match the spec.
6. If you're adding copy: is it a CLOSE button? Use `CLOSE ✕` exactly.
7. Read `## 7. Don'ts` one more time. Then ship.
