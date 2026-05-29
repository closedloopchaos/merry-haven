// Horizontal time-axis "tape" — current familiar look, now with
// color/opacity-only hover transitions (no layout shift).

function formatT(seconds) {
  const sign = seconds < 0 ? '-' : '+';
  const abs = Math.abs(seconds);
  const m = Math.floor(abs / 60);
  const s = Math.floor(abs % 60);
  return `T${sign}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function tickInterval(durationSec) {
  if (durationSec <= 600)  return 60;
  if (durationSec <= 1200) return 120;
  if (durationSec <= 1800) return 300;
  if (durationSec <= 3600) return 600;
  return 900;
}

function shortTickLabel(seconds) {
  if (seconds === 0) return 'T-0';
  if (seconds < 3600) return `+${Math.round(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m === 0 ? `+${h}h` : `+${h}h${m}`;
}

const TIERS = [
  { side: 'above', dist: 1 },
  { side: 'below', dist: 1 },
  { side: 'above', dist: 2 },
  { side: 'below', dist: 2 },
];

export default function TimelineTape({ timeline, activeIdx, selectedIdx, onHover, onClick }) {
  const dur = timeline.duration;
  const VB_W = 1200;
  const VB_H = 700;
  const PAD_X = 40;
  const usableW = VB_W - PAD_X * 2;
  const axisY = VB_H * 0.5;
  const TIER_OFFSET = 90;

  const xFor = (t) => PAD_X + (t / dur) * usableW;
  const tickStep = tickInterval(dur);
  const ticks = [];
  for (let t = 0; t <= dur; t += tickStep) ticks.push(t);

  return (
    <svg
      className="timeline__svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        x1={PAD_X} y1={axisY}
        x2={VB_W - PAD_X} y2={axisY}
        stroke="rgba(255,255,255,0.28)" strokeWidth="1"
      />

      {ticks.map((t, i) => {
        const x = xFor(t);
        return (
          <g key={`tick-${i}`}>
            <line x1={x} y1={axisY - 8} x2={x} y2={axisY + 8}
                  stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            <text x={x} y={axisY + 36}
                  fontSize="20"
                  fontFamily="JetBrains Mono, monospace"
                  fill="rgba(255,255,255,0.5)"
                  textAnchor="middle"
                  letterSpacing="0.1em">
              {shortTickLabel(t)}
            </text>
          </g>
        );
      })}

      {timeline.milestones.map((m, i) => {
        const x = xFor(m.t);
        const tier = TIERS[i % TIERS.length];
        const dir = tier.side === 'above' ? -1 : 1;
        const stemEnd  = axisY + dir * (40 + (tier.dist - 1) * TIER_OFFSET);
        const nameY    = axisY + dir * (54 + (tier.dist - 1) * TIER_OFFSET);
        const tY       = axisY + dir * (78 + (tier.dist - 1) * TIER_OFFSET);
        const isActive   = activeIdx === i;
        const isSelected = selectedIdx === i;
        const hitY1 = Math.min(axisY, tY) - 18;
        const hitY2 = Math.max(axisY, tY) + 18;
        const baselineNameY = dir < 0 ? nameY : nameY + 4;
        const baselineTY    = dir < 0 ? tY    : tY + 4;

        // No size changes — only opacity & color shift
        const stemOpacity = isActive ? 1 : 0.55;
        const textOpacity = isActive ? 1 : 0.7;

        return (
          <g key={`m-${i}`}
             className="timeline-tape__milestone"
             onMouseEnter={() => onHover(i)}
             onMouseLeave={() => onHover(null)}
             onClick={() => onClick(i)}
             style={{ cursor: 'pointer' }}>
            <rect x={x - 50} y={hitY1}
                  width="100" height={hitY2 - hitY1}
                  fill="transparent" />
            <line x1={x} y1={axisY + dir * 9} x2={x} y2={stemEnd}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  style={{ opacity: stemOpacity, transition: 'opacity 0.15s ease' }} />
            <circle cx={x} cy={stemEnd}
                    r="5"
                    fill="var(--accent)"
                    style={{ opacity: stemOpacity, transition: 'opacity 0.15s ease' }} />
            {isSelected && (
              <circle cx={x} cy={stemEnd}
                      r="12" fill="none"
                      stroke="var(--accent)" strokeWidth="1.2" opacity="0.55" />
            )}
            <text x={x} y={baselineNameY}
                  fontSize="22"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                  fill="#fff"
                  textAnchor="middle"
                  letterSpacing="0.1em"
                  style={{ opacity: textOpacity, transition: 'opacity 0.15s ease' }}>
              {m.name}
            </text>
            <text x={x} y={baselineTY}
                  fontSize="18"
                  fontFamily="JetBrains Mono, monospace"
                  fill="var(--accent)"
                  textAnchor="middle"
                  letterSpacing="0.06em"
                  style={{ opacity: textOpacity, transition: 'opacity 0.15s ease' }}>
              {formatT(m.t)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
