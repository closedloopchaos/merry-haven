import { useEffect, useRef, useState } from 'react';

const PULSE_HOLD_MS = 4_500;

// Tracks launches whose status.abbrev has flipped since the last update.
// Returns:
//   - changedIds: Set<launchId> for row-level pulse highlights
//   - latestEvent: { launchId, name, fromStatus, toStatus, timestamp } for the
//     top status banner (most recent flip; null after dismiss)
//   - dismiss: () => void to clear the banner manually
export function useStatusChanges(launches) {
  const prevRef = useRef(new Map());     // launchId -> last status abbrev
  const initRef = useRef(false);
  const [changedIds, setChangedIds] = useState(new Set());
  const [latestEvent, setLatestEvent] = useState(null);

  useEffect(() => {
    const next = new Map();
    const flips = [];
    const events = [];

    for (const l of launches) {
      if (!l?.id) continue;
      const cur = l.status?.abbrev ?? '';
      next.set(l.id, cur);
      const prev = prevRef.current.get(l.id);
      if (initRef.current && prev != null && prev !== cur) {
        flips.push(l.id);
        events.push({
          launchId: l.id,
          name: l.name ?? '',
          fromStatus: prev,
          toStatus: cur,
          timestamp: Date.now(),
        });
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

    // Banner shows the most recent flip; if multiple in one tick, take the last
    setLatestEvent(events[events.length - 1]);

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

  function dismiss() { setLatestEvent(null); }

  return { changedIds, latestEvent, dismiss };
}
