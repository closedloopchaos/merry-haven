import { useState, useEffect } from 'react';

function formatTMinus(ms) {
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const s = Math.floor((abs % 60_000) / 1000);
  const sign = ms < 0 ? 'T+' : 'T-';
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Progressive intensification as the clock ticks down.
// far / approaching are calm; imminent / critical brighten; urgent + launched go red.
function tier(ms) {
  if (ms <= 0)         return 'launched';   // T+
  if (ms <= 60_000)    return 'urgent';     // T-1m
  if (ms <= 300_000)   return 'critical';   // T-5m
  if (ms <= 900_000)   return 'imminent';   // T-15m
  if (ms <= 3_600_000) return 'approaching';// T-1h
  return 'far';
}

export default function CountdownClock({ netTime, className = '' }) {
  const [ms, setMs] = useState(() => Date.parse(netTime) - Date.now());

  useEffect(() => {
    setMs(Date.parse(netTime) - Date.now());
    const id = setInterval(() => setMs(Date.parse(netTime) - Date.now()), 1000);
    return () => clearInterval(id);
  }, [netTime]);

  return (
    <span className={`countdown countdown--${tier(ms)} ${className}`}>
      {formatTMinus(ms)}
    </span>
  );
}
