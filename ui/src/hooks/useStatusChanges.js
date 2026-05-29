import { useEffect, useRef, useState } from 'react';

const PULSE_HOLD_MS = 4_500;

// Tracks launches whose status.abbrev has flipped since the last update.
// Returns a Set of launch ids that should display the pulse.
export function useStatusChanges(launches) {
  const prevRef = useRef(new Map());     // launchId -> last status abbrev
  const initRef = useRef(false);
  const [changedIds, setChangedIds] = useState(new Set());

  useEffect(() => {
    const next = new Map();
    const flips = [];

    for (const l of launches) {
      if (!l?.id) continue;
      const cur = l.status?.abbrev ?? '';
      next.set(l.id, cur);
      const prev = prevRef.current.get(l.id);
      if (initRef.current && prev != null && prev !== cur) {
        flips.push(l.id);
      }
    }

    prevRef.current = next;
    initRef.current = true;

    if (flips.length === 0) return;

    setChangedIds(prev => {
      const merged = new Set(prev);
      flips.forEach(id => merged.add(id));
      return merged;
    });

    const timers = flips.map(id => setTimeout(() => {
      setChangedIds(prev => {
        if (!prev.has(id)) return prev;
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }, PULSE_HOLD_MS));

    return () => timers.forEach(clearTimeout);
  }, [launches]);

  return changedIds;
}
