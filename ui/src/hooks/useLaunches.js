import { useState, useEffect, useMemo } from 'react';

const CLEAR_AFTER_MS = 5 * 60 * 1000; // T+5 min — past launches drop off the list

export function useLaunches() {
  const [rawLaunches, setRawLaunches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  // Tick once per minute so the filter re-evaluates without requiring a refetch
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchLaunches() {
      try {
        const res = await fetch('/api/launches');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setRawLaunches(data.results ?? []);
          setLastFetched(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLaunches();
    const fetchInterval = setInterval(fetchLaunches, 5 * 60 * 1000);
    const tickInterval  = setInterval(() => setTick(t => t + 1), 30 * 1000);
    return () => {
      cancelled = true;
      clearInterval(fetchInterval);
      clearInterval(tickInterval);
    };
  }, []);

  const launches = useMemo(() => {
    const cutoff = Date.now() - CLEAR_AFTER_MS;
    return rawLaunches.filter(l => {
      const t = Date.parse(l?.net);
      if (!Number.isFinite(t)) return true; // keep unknowns
      return t > cutoff;
    });
  }, [rawLaunches, tick]);

  return { launches, error, loading, lastFetched };
}
