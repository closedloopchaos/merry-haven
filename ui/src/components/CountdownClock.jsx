import { useState, useEffect } from 'react';

function formatTMinus(ms) {
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const s = Math.floor((abs % 60_000) / 1000);
  const sign = ms < 0 ? 'T+' : 'T-';
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function CountdownClock({ netTime, className = '' }) {
  const [ms, setMs] = useState(() => Date.parse(netTime) - Date.now());

  useEffect(() => {
    setMs(Date.parse(netTime) - Date.now());
    const id = setInterval(() => setMs(Date.parse(netTime) - Date.now()), 1000);
    return () => clearInterval(id);
  }, [netTime]);

  const urgent = ms > 0 && ms <= 60_000;
  const launched = ms <= 0;

  return (
    <span className={`countdown ${urgent ? 'countdown--urgent' : ''} ${launched ? 'countdown--launched' : ''} ${className}`}>
      {formatTMinus(ms)}
    </span>
  );
}
