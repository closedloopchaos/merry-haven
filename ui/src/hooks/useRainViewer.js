import { useState, useEffect } from 'react';

const RAINVIEWER_URL = 'https://api.rainviewer.com/public/weather-maps.json';
const REFRESH_MS = 5 * 60 * 1000;

export default function useRainViewer() {
  const [radar, setRadar] = useState(null);

  useEffect(() => {
    async function fetchRadar() {
      try {
        const res = await fetch(RAINVIEWER_URL);
        if (!res.ok) return;
        const data = await res.json();
        const past = data?.radar?.past;
        if (!past?.length) return;
        const latest = past[past.length - 1];
        setRadar({ host: data.host, path: latest.path });
      } catch {
        // silent — radar is non-critical
      }
    }

    fetchRadar();
    const id = setInterval(fetchRadar, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return radar;
}
