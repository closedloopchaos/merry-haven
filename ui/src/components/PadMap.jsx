import { useRef, useState, useCallback, useEffect } from 'react';

const PADS = [
  { id: 'LC-39B',  short: '39B', match: ['39b', 'la-39b', 'lc-39b'],                              x: 30, y: 12, site: 'KSC' },
  { id: 'LC-39A',  short: '39A', match: ['39a', 'la-39a', 'lc-39a'],                              x: 32, y: 22, site: 'KSC' },
  { id: 'SLC-40',  short: '40',  match: ['slc-40', 'space launch complex 40', 'lc-40'],           x: 38, y: 42, site: 'CCSFS' },
  { id: 'SLC-41',  short: '41',  match: ['slc-41', 'space launch complex 41', 'lc-41'],           x: 41, y: 54, site: 'CCSFS' },
  { id: 'SLC-37',  short: '37',  match: ['slc-37', 'lc-37'],                                       x: 42, y: 68, site: 'CCSFS' },
  { id: 'LC-36',   short: '36',  match: ['lc-36', 'launch complex 36'],                            x: 43, y: 78, site: 'CCSFS' },
  { id: 'SLC-46',  short: '46',  match: ['slc-46', 'lc-46'],                                       x: 46, y: 88, site: 'CCSFS' },
];

const DEFAULT_VB = { x: 0, y: 0, w: 100, h: 100 };
const MIN_W = 4;     // ~25x max zoom
const MAX_W = 100;   // 1x = full default

function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
function isFiniteNum(n) { return typeof n === 'number' && Number.isFinite(n); }

function relShort(iso) {
  const ms = Date.parse(iso) - Date.now();
  if (!Number.isFinite(ms) || ms < 0) return 'TBD';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h < 24) return `T-${String(h).padStart(2, '0')}H ${String(m).padStart(2, '0')}M`;
  const d = Math.floor(h / 24);
  return `T-${d}D ${h % 24}H`;
}

function findNextLaunchForPad(pad, launches) {
  const name = (l) => (l.pad?.name ?? '').toLowerCase();
  return launches.find(l => pad.match.some(m => name(l).includes(m))) ?? null;
}

export default function PadMap({ launches = [] }) {
  const [vb, setVb] = useState(DEFAULT_VB);
  const dragRef = useRef(null);
  const svgRef = useRef(null);

  // Native non-passive wheel listener — React's onWheel is passive by default
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function onWheel(e) {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const factor = e.deltaY > 0 ? 1.20 : 1 / 1.20;
      setVb(prev => {
        if (!isFiniteNum(prev.w) || prev.w <= 0) return DEFAULT_VB;
        const targetW = prev.w * factor;
        const newW = clamp(targetW, MIN_W, MAX_W);
        const newH = newW;
        if (!isFiniteNum(newW) || newW <= 0) return prev;
        const pxRaw = (e.clientX - rect.left) / rect.width;
        const pyRaw = (e.clientY - rect.top)  / rect.height;
        const px = clamp(isFiniteNum(pxRaw) ? pxRaw : 0.5, 0, 1);
        const py = clamp(isFiniteNum(pyRaw) ? pyRaw : 0.5, 0, 1);
        const cx = prev.x + prev.w * px;
        const cy = prev.y + prev.h * py;
        const nx = cx - newW * px;
        const ny = cy - newH * py;
        if (!isFiniteNum(nx) || !isFiniteNum(ny)) return prev;
        return { x: nx, y: ny, w: newW, h: newH };
      });
    }

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  const padActivity = PADS.map(pad => ({
    ...pad,
    next: findNextLaunchForPad(pad, launches),
  }));

  const upcoming = padActivity
    .filter(p => p.next)
    .sort((a, b) => Date.parse(a.next.net) - Date.parse(b.next.net));
  const soonest = upcoming[0];

  const handleMouseDown = useCallback((e) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, vbx: vb.x, vby: vb.y };
  }, [vb.x, vb.y]);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    const dx = (e.clientX - dragRef.current.sx) / rect.width  * vb.w;
    const dy = (e.clientY - dragRef.current.sy) / rect.height * vb.h;
    if (!isFiniteNum(dx) || !isFiniteNum(dy)) return;
    setVb(v => ({ ...v, x: dragRef.current.vbx - dx, y: dragRef.current.vby - dy }));
  }, [vb.w, vb.h]);

  const handleMouseUp = useCallback(() => { dragRef.current = null; }, []);

  const reset = useCallback(() => setVb(DEFAULT_VB), []);

  const zoomPct = Math.round((DEFAULT_VB.w / vb.w) * 100);
  const labelScale = vb.w / DEFAULT_VB.w; // shrink text as we zoom in so it doesn't dominate

  return (
    <div className="pad-map">
      <div className="pad-map__controls">
        <span className="pad-map__zoom">{zoomPct}%</span>
        <button className="pad-map__reset" onClick={reset}>RESET</button>
      </div>

      <svg
        ref={svgRef}
        className="pad-map__svg"
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Coastline hint — single dim vertical line on the right */}
        <line x1="60" y1="-10" x2="60" y2="110" stroke="rgba(255,255,255,0.10)" strokeWidth={0.3 * labelScale} />

        {/* Banana River hint between KSC and CCSFS */}
        <path d="M 0 32 Q 25 32 32 38 T 60 60"
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5 * labelScale} />

        {/* Site name labels */}
        <text x="2" y="6" fontSize={3.2 * labelScale}
              fontFamily="JetBrains Mono, monospace"
              fill="rgba(255,255,255,0.5)" letterSpacing="0.18em">KSC</text>
        <text x="2" y="38" fontSize={3.2 * labelScale}
              fontFamily="JetBrains Mono, monospace"
              fill="rgba(255,255,255,0.5)" letterSpacing="0.18em">CCSFS</text>

        {padActivity.map(pad => {
          const active = pad.id === soonest?.id;
          const sz = 2.4 * labelScale;
          const fontSz = 3.2 * labelScale;
          const subSz  = 2.3 * labelScale;
          return (
            <g key={pad.id}>
              {active ? (
                <rect x={pad.x - sz/2} y={pad.y - sz/2} width={sz} height={sz} fill="var(--accent)" />
              ) : (
                <rect x={pad.x - sz/2} y={pad.y - sz/2} width={sz} height={sz}
                      fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={0.4 * labelScale} />
              )}
              <text
                x={pad.x + sz/2 + 1.6 * labelScale}
                y={pad.y + 1.2 * labelScale}
                fontSize={fontSz}
                fontFamily="JetBrains Mono, monospace"
                fill={active ? '#fff' : 'rgba(255,255,255,0.5)'}
                letterSpacing="0.04em"
              >
                {pad.short}
              </text>
              {active && (
                <text
                  x={pad.x + sz/2 + 1.6 * labelScale}
                  y={pad.y + 4.6 * labelScale}
                  fontSize={subSz}
                  fontFamily="JetBrains Mono, monospace"
                  fill="var(--accent)"
                  letterSpacing="0.04em"
                >
                  {pad.next.launch_service_provider?.abbrev ?? ''}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {soonest && (
        <div className="pad-map__next">
          <span className="pad-map__next-label">NEXT</span>
          <span className="pad-map__next-pad">{soonest.short}</span>
          <span className="pad-map__next-time">{relShort(soonest.next.net)}</span>
        </div>
      )}

      <p className="pad-map__hint">SCROLL TO ZOOM · DRAG TO PAN</p>
    </div>
  );
}
