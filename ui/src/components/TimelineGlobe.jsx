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

  // Compute pad + trajectory once per launch
  const padCoords   = getPadCoords(launch);
  const inclination = getInclination(launch);
  const azimuth     = azimuthForInclination(inclination, padCoords[1]);
  // Show ~3/4 of the orbital plane around the pad — enough to see where it's going
  const trajectory  = greatCircle(padCoords, azimuth, 270);
  // First 8 minutes of "active" ascent track (lighter so it's visible vs orbital plane)
  const ascent      = greatCircle(padCoords, azimuth, 40, 32);

  // Initial rotation centers on the pad
  useEffect(() => {
    setRotation([-padCoords[0], -padCoords[1]]);
  }, [padCoords[0], padCoords[1]]);

  // Load land outlines once
  useEffect(() => {
    let cancelled = false;
    loadLand().then(l => { if (!cancelled) setLand(l); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Drag-to-rotate
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

  const projection = geoOrthographic()
    .scale(R)
    .translate([W / 2, H / 2])
    .rotate(rotation)
    .clipAngle(90);

  const path = geoPath().projection(projection);
  const padPoint = projection(padCoords);
  const padVisible = !!padPoint;

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
        {/* Outer atmospheric halo */}
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="92%" stopColor="rgba(230,57,70,0)" />
            <stop offset="100%" stopColor="rgba(230,57,70,0.45)" />
          </radialGradient>
        </defs>
        <circle cx={W/2} cy={H/2} r={R + 14} fill="url(#halo)" pointerEvents="none" />

        {/* Sphere fill */}
        <circle cx={W/2} cy={H/2} r={R} fill="rgba(255,255,255,0.015)" />

        {/* Graticule */}
        <path d={path(geoGraticule10())}
              fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />

        {/* Land outlines */}
        {land && (
          <path d={path(land)}
                fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        )}

        {/* Sphere outline */}
        <circle cx={W/2} cy={H/2} r={R}
                fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />

        {/* Orbital-plane great-circle (faint) */}
        <path d={path({ type: 'LineString', coordinates: trajectory })}
              fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.55" />

        {/* Active ascent track (bright) */}
        <path d={path({ type: 'LineString', coordinates: ascent })}
              fill="none" stroke="var(--accent)" strokeWidth="3" />

        {/* Pad marker */}
        {padVisible && (
          <g>
            <circle cx={padPoint[0]} cy={padPoint[1]} r="6" fill="var(--accent)" />
            <circle cx={padPoint[0]} cy={padPoint[1]} r="14"
                    fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.45" />
            <circle cx={padPoint[0]} cy={padPoint[1]} r="22"
                    fill="none" stroke="var(--accent)" strokeWidth="0.6" opacity="0.25" />
            <text x={padPoint[0] + 16} y={padPoint[1] + 5}
                  fontSize="13"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                  fill="#fff"
                  letterSpacing="0.14em">
              {(launch?.pad?.location?.name ?? 'PAD').toUpperCase()}
            </text>
          </g>
        )}
      </svg>

      <p className="timeline-globe__hint">DRAG GLOBE TO ROTATE</p>
    </div>
  );
}
