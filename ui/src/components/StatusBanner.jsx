import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const STATUS_LABELS = {
  Go:          'GO',
  TBD:         'TBD',
  Hold:        'HOLD',
  Success:     'SUCCESS',
  Failure:     'FAILURE',
  'In Flight': 'IN FLIGHT',
};

function label(s) { return STATUS_LABELS[s] ?? (s || '??'); }

const AUTO_DISMISS_MS = 30_000;

export default function StatusBanner({ event, onDismiss }) {
  useEffect(() => {
    if (!event) return;
    const id = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [event?.timestamp]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.timestamp}
          className="status-banner"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="status-banner__phase">STATUS CHANGE</span>
          <span className="status-banner__name">{event.name}</span>
          <span className="status-banner__transition">
            {label(event.fromStatus)} → {label(event.toStatus)}
          </span>
          <button className="status-banner__close" onClick={onDismiss}>CLOSE ✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
