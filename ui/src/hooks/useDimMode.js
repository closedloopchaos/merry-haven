import { useEffect, useState } from 'react';

// 22:00 → 06:00 local: dim the entire UI as OLED burn-in protection.
// filter: brightness() actually reduces emitted brightness on OLED;
// opacity does NOT (it just blends with the background).
export function useDimMode() {
  const [dim, setDim] = useState(() => {
    const h = new Date().getHours();
    return h >= 22 || h < 6;
  });

  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      setDim(h >= 22 || h < 6);
    }
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return dim;
}
