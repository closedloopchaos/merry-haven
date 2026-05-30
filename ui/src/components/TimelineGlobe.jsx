import { useEffect, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import {
  getInclination,
  getPadCoords,
  azimuthForInclination,
  greatCircle,
} from '../data/orbits.js';

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

let cachedLand = null;
async function loadLand() {
  if (cachedLand) return cachedLand;
  const res = await fetch(WORLD_URL);
  if (!res.ok) throw new Error('land fetch failed');
  const topo = await res.json();
  cachedLand = feature(topo, topo.objects.land);
  return cachedLand;
}

export default function TimelineGlobe({ launch }) {
  const [land, setLand] = useState(null);
  const [rotation, setRotation] = useState(null);
  const dragRef = useRef(null);
  const svgRef = useRef(null);

  const padCoords   = getPadCoords(launch);
  const inclination = getInclination(launch);
  const azimuth     = azimuthForInclination(inclination, padCoords[1]);
  const trajectory  = greatCircle(padCoords, azimuth, 270);
  const ascent      = greatCircle(padCoords, azimuth, 40, 48);

  useEffect(() => {
    setRotation([-padCoords[0], -padCoords[1]]);
  }, [padCoords[0], padCoords[1]]);

  useEffect(() => {
    let cancelled = false;
    loadLand().then(l => { if (!cancelled) setLand(l); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  function onMouseDown(e) {
    if (!rotation) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, rx: rotation[0], ry: rotation[1] };
  }
  function onMouseMove(e) {
    if (!dragRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const sens = 360 / rect.width;
    const dx = (e.clientX - dragRef.current.sx) * sens;
    const dy = (e.clientY - dragRef.current.sy) * sens;
    setRotation([dragRef.current.rx + dx, Math.max(-90, Math.min(90, dragRef.current.ry - dy))]);
  }
  function onMouseUp() { dragRef.current = null; }
  function recenter() {
    setRotation([-padCoords[0], -padCoords[1]]);
  }

  if (!rotation) return null;

  const W = 700;
  const H = 700;
  const R = W * 0.46;
  const CX = W / 2;
  const CY = H / 2;
  const ORBIT_LIFT = 0.055;

  const projection = geoOrthographic()
    .scale(R)
    .translate([CX, CY])
    .rotate(rotation)
    .clipAngle(90);

  const path = geoPath().projection(projection);
  const padPoint = projection(padCoords);
  const padVisible = !!padPoint;

  // Radially offset a projected point outward from the globe center.
  // In orthographic projection a point at altitude h above R projects to
  // (1 + h/R) × surface position, so this is geometrically accurate.
  function liftPoint(p, liftRatio) {
    if (!p) return null;
    const k = 1 + liftRatio;
    return [CX + (p[0] - CX) * k, CY + (p[1] - CY) * k];
  }

  function pathFromPoints(pts) {
    let d = '';
    let started = false;
    for (const p of pts) {
      if (!p) { started = false; continue; }
      d += started
        ? `L${p[0].toFixed(1)} ${p[1].toFixed(1)} `
        : `M${p[0].toFixed(1)} ${p[1].toFixed(1)} `;
      started = true;
    }
    return d;
  }

  const orbitPathD = pathFromPoints(
    trajectory.map(c => liftPoint(projection(c), ORBIT_LIFT))
  );
  const ascentPathD = pathFromPoints(
    ascent.map((c, i) => {
      const t = i / Math.max(1, ascent.length - 1);
      return liftPoint(projection(c), t * ORBIT_LIFT);
    })
  );
  const groundTrackD = path({ type: 'LineString', coordinates: trajectory });

  // Lifted pad marker — slightly above surface so the orbit visually anchors to it
  const padLifted = padVisible ? liftPoint(padPoint, ORBIT_LIFT) : null;

  return (
    <div className="timeline-globe-wrap">
      <div className="timeline-globe__chrome">
        <div className="timeline-globe__readout">
          <span className="timeline-globe__lbl">PAD</span>
          <span className="timeline-globe__val">
            {padCoords[1].toFixed(2)}°N · {Math.abs(padCoords[0]).toFixed(2)}°W
          </span>
          <span className="timeline-globe__sep">·</span>
          <span className="timeline-globe__lbl">INC</span>
          <span className="timeline-globe__val">{inclination.toFixed(1)}°</span>
        </div>
        <button className="timeline-globe__recenter" onClick={recenter}>RECENTER</button>
      </div>

      <svg
        ref={svgRef}
        className="timeline-globe"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <defs>
          {/* Atmospheric halo */}
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="92%" stopColor="rgba(230,57,70,0)" />
            <stop offset="100%" stopColor="rgba(230,57,70,0.45)" />
          </radialGradient>
          {/* Sphere shading — light from upper-left, limb-darkened */}
          <radialGradient id="globe-shade" cx="32%" cy="28%" r="78%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
            <stop offset="42%"  stopColor="rgba(255,255,255,0.04)" />
            <stop offset="78%"  stopColor="rgba(0,0,0,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.65)" />
          </radialGradient>
          {/* Glow for engine-trail / pad */}
          <filter id="ascent-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Mask: only show inside the sphere (used for surface graticule/land) */}
          <clipPath id="globe-clip">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {/* Atmospheric halo */}
        <circle cx={CX} cy={CY} r={R + 14} fill="url(#halo)" pointerEvents="none" />

        {/* Sphere base — dark ocean tone */}
        <circle cx={CX} cy={CY} r={R} fill="rgba(0,0,0,0.55)" />

        {/* Graticule (clipped to sphere) */}
        <g clipPath="url(#globe-clip)">
          <path d={path(geoGraticule10())}
                fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />

          {/* Land — subtle fill + outline */}
          {land && (
            <>
              <path d={path(land)} fill="rgba(255,255,255,0.07)" stroke="none" />
              <path d={path(land)} fill="none"
                    stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" />
            </>
          )}

          {/* Faint ground track on the surface */}
          <path d={groundTrackD}
                fill="none" stroke="var(--accent)" strokeWidth="0.9" opacity="0.28" />
        </g>

        {/* Sphere shading overlay (gives the 3D shaded ball look) */}
        <circle cx={CX} cy={CY} r={R} fill="url(#globe-shade)" pointerEvents="none" />

        {/* Sphere outline */}
        <circle cx={CX} cy={CY} r={R}
                fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />

        {/* Orbital path — lifted above surface, glowing */}
        <path d={orbitPathD}
              fill="none" stroke="var(--accent)" strokeWidth="1.6"
              opacity="0.75" filter="url(#ascent-glow)" />

        {/* Ascent — rises from pad to orbit altitude */}
        <path d={ascentPathD}
              fill="none" stroke="var(--accent)" strokeWidth="3.2"
              strokeLinecap="round" filter="url(#ascent-glow)" />

        {/* Pad marker on surface + tether line up to orbital insertion */}
        {padVisible && (
          <>
            {padLifted && (
              <line x1={padPoint[0]} y1={padPoint[1]}
                    x2={padLifted[0]} y2={padLifted[1]}
                    stroke="var(--accent)" strokeWidth="0.6" opacity="0.5"
                    strokeDasharray="2 3" pointerEvents="none" />
            )}
            <g filter="url(#ascent-glow)">
              <circle cx={padPoint[0]} cy={padPoint[1]} r="5" fill="var(--accent)" />
              <circle cx={padPoint[0]} cy={padPoint[1]} r="12"
                      fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
              <circle cx={padPoint[0]} cy={padPoint[1]} r="20"
                      fill="none" stroke="var(--accent)" strokeWidth="0.6" opacity="0.22" />
            </g>
            <text x={padPoint[0] + 16} y={padPoint[1] + 5}
                  fontSize="13"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                  fill="#fff"
                  letterSpacing="0.14em">
              {(launch?.pad?.location?.name ?? 'PAD').toUpperCase()}
            </text>
          </>
        )}
      </svg>

      <p className="timeline-globe__hint">DRAG GLOBE TO ROTATE</p>
    </div>
  );
}
