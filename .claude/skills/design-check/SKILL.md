---
name: design-check
description: Use when the user asks to verify a change against DESIGN.md, audit the brutalist art-poster constraints, or check for design violations before shipping. Also use proactively after non-trivial visual changes before declaring them complete.
---

# Design Check

Audit the current state of the working tree against `DESIGN.md`'s rules. Catch the brutalist-art-poster violations the user cares most about before they reach the screen.

## What to check

Read `DESIGN.md` to refresh the rules, then run these scans (use the Grep tool, scope to `ui/src/`):

### Hard violations — flag every match

1. **Color tokens** — any hex/rgb/hsl literal outside the `:root` block.
   - Pattern: `#[0-9a-fA-F]{3,8}\b|rgb\(|rgba\(|hsl\(|hsla\(`
   - Allowed: matches inside `ui/src/styles/index.css` between the `:root {` opening and its closing `}`, plus the Countdown View band colors (`#00ff66`, `#ffcc00`, `#ff2233`) in `.countdown-view__clock-block--*` rules and the inline `radialGradient`/halo definition in `TimelineGlobe.jsx`. Everything else is a violation.

2. **Banned glyphs and ornaments in copy.**
   - Box-drawing: `[┌┐└┘─│█░╔╗╚╝]`
   - Decorative: `[◈❦❧※✦✠]`
   - Square-bracketed labels like `[GO]`, `[ x ]`, `[NEXT]` outside the literal `[ – ]` historic minimize button (which should already be gone — flag if it reappears).

3. **Banned CSS properties.**
   - `text-shadow` for emphasis (the only legal use is the no-op `none !important` overrides on `__clock`). Anywhere else is a violation.
   - `border-radius` with a non-zero value.
   - Status badges with `background:` set (badges must be plain text in `var(--accent)`).

### Soft violations — note but don't block

4. **Letter-spacing on mono labels** that isn't `0.18em` (or the documented exceptions `0.14em` in ticker pills, `0.22em` in HUD overlays). Worth a glance.

5. **Font cross-use** — `font-family: var(--font-mono)` paired with `font-size > 16px`, or `var(--font-display)` paired with `font-size < 14px`. Likely a misapplication of the size scale.

6. **`MIN`, `DISMISS`, `BACK`, `EXIT`, `HIDE`, `COLLAPSE`** as button text — should be `CLOSE ✕`.

## Output format

Report as a tight list grouped by file. For each hit: file path, line, the offending snippet, and which DESIGN.md section it violates.

If clean: one line — "Clean. No DESIGN.md violations found in the working tree." Do not pad it out.
