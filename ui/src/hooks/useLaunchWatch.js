import { useState, useEffect, useCallback } from 'react';

const TRIGGER_MS  = 10 * 60 * 1000;  // T-10 min — launch mode
const RESET_MS    = 30 * 60 * 1000;  // T+30 min — auto-dismiss launch mode
const COUNTDOWN_PRE_MS  = 60 * 1000;  // T-1 min — countdown view starts
const COUNTDOWN_POST_MS = 30 * 1000;  // T+30 sec — countdown view auto-dismiss

// Only TBD/Hold are not worth activating for; all others (Go, In Flight, Success, Failure) are
const SKIP_STATUS = new Set(['TBD', 'Hold']);

export function useLaunchWatch(launches) {
  const [launchMode, setLaunchMode] = useState(false);
  const [countdownMode, setCountdownMode] = useState(false);
  const [activeLaunch, setActiveLaunch] = useState(null);
  const [dismissedId, setDismissedId] = useState(null);
  const [countdownDismissedId, setCountdownDismissedId] = useState(null);

  useEffect(() => {
    function check() {
      const actionable = launches.filter(l => !SKIP_STATUS.has(l.status?.abbrev));

      if (!actionable.length) {
        setLaunchMode(false);
        setCountdownMode(false);
        setActiveLaunch(null);
        return;
      }

      const next = actionable[0];
      const msUntilNet = Date.parse(next.net) - Date.now();
      const inLaunchWindow   = msUntilNet <= TRIGGER_MS       && msUntilNet > -RESET_MS;
      const inCountdownWindow = msUntilNet <= COUNTDOWN_PRE_MS && msUntilNet > -COUNTDOWN_POST_MS;

      if (inLaunchWindow && next.id !== dismissedId) {
        setLaunchMode(true);
        setActiveLaunch(next);
      } else {
        setLaunchMode(false);
        if (!inCountdownWindow) setActiveLaunch(null);
      }

      if (inCountdownWindow && next.id !== countdownDismissedId) {
        setCountdownMode(true);
        setActiveLaunch(next);
      } else {
        setCountdownMode(false);
      }
    }

    check();
    const interval = setInterval(check, 1_000);
    return () => clearInterval(interval);
  }, [launches, dismissedId, countdownDismissedId]);

  const dismiss = useCallback(() => {
    setDismissedId(activeLaunch?.id ?? null);
    setActiveLaunch(null);
    setLaunchMode(false);
  }, [activeLaunch?.id]);

  const dismissCountdown = useCallback(() => {
    setCountdownDismissedId(activeLaunch?.id ?? null);
    setCountdownMode(false);
  }, [activeLaunch?.id]);

  return { launchMode, countdownMode, activeLaunch, dismiss, dismissCountdown };
}
