import { useState, useEffect } from 'react';

function celsiusToF(c) {
  return c != null ? Math.round(c * 9 / 5 + 32) : null;
}

function msToMph(ms) {
  return ms != null ? Math.round(ms * 2.237) : null;
}

function metersToMiles(m) {
  return m != null ? Math.round((m / 1609.34) * 10) / 10 : null;
}

function calcDewPointF(tempC, rh) {
  if (tempC == null || rh == null || rh <= 0) return null;
  const gamma = Math.log(rh / 100) + (17.625 * tempC) / (243.04 + tempC);
  const dpC = (243.04 * gamma) / (17.625 - gamma);
  return celsiusToF(dpC);
}

function parseObservation(obs) {
  const p = obs?.properties ?? {};
  const tempC = p.temperature?.value ?? null;
  const rh = p.relativeHumidity?.value != null ? Math.round(p.relativeHumidity.value) : null;
  return {
    temperature: celsiusToF(tempC),
    dewPoint: calcDewPointF(tempC, rh),
    windSpeed: msToMph(p.windSpeed?.value),
    windDirection: p.windDirection?.value ?? null,
    windGust: msToMph(p.windGust?.value),
    visibility: metersToMiles(p.visibility?.value),
    relativeHumidity: rh,
    textDescription: p.textDescription ?? '',
    obsTime: p.timestamp
      ? new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : null,
  };
}

export function useWeather(site) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const station = site?.nwsStation ?? '';
  const lat = site?.coords?.[1] ?? '';
  const lon = site?.coords?.[0] ?? '';

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      try {
        const params = new URLSearchParams();
        if (station) params.set('station', station);
        if (lat !== '' && lon !== '') {
          params.set('lat', String(lat));
          params.set('lon', String(lon));
        }
        const url = '/api/weather' + (params.toString() ? `?${params}` : '');
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setWeather({
            ...parseObservation(data.observation),
            periods: data.forecast?.properties?.periods?.slice(0, 8) ?? [],
          });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [station, lat, lon]);

  return { weather, error };
}
