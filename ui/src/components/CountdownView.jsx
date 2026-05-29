import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountdownClock from './CountdownClock.jsx';

const STREAMS = [
  { id: 'spacecoast', label: 'SPACE COAST', url: 'https://www.youtube.com/embed/Jm8wRjD3xVA?autoplay=1&mute=1' },
  { id: 'starbase',   label: 'STARBASE',    url: 'https://www.youtube.com/embed/mhJRzQsLZGg?autoplay=1&mute=1' },
  { id: 'mcgregor',   label: 'MCGREGOR',    url: 'https://www.youtube.com/embed/cOmmvhDQ2HM?autoplay=1&mute=1' },
];

function autoSelectStream(launch) {
  if (!launch) return STREAMS[0];
  const loc = (launch.pad?.location?.name ?? '').toLowerCase();
  const pad = (launch.pad?.name ?? '').toLowerCase();
  if (loc.includes('boca chica') || loc.includes('starbase') || pad.includes('starbase')) return STREAMS[1];
  if (loc.includes('mcgregor')) return STREAMS[2];
  return STREAMS[0];
}

function bandForMs(ms) {
  const s = ms / 1000;
  if (s <= 30) return 'red';
  if (s <= 45) return 'yellow';
  if (s <= 60) return 'green';
  return 'default';
}

function useCountdownBand(netTime) {
  const [band, setBand] = useState(() => bandForMs(Date.parse(netTime) - Date.now()));
  useEffect(() => {
    function tick() { setBand(bandForMs(Date.parse(netTime) - Date.now())); }
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [netTime]);
  return band;
}

const HUD_DECEL = [0.16, 1, 0.3, 1];

export default function CountdownView({ launch, isTest, onDismiss }) {
  const band = useCountdownBand(launch?.net);
  if (!launch) return null;
  const stream = autoSelectStream(launch);
  const pad = launch.pad?.name ?? '';
  const location = launch.pad?.location?.name ?? '';
  const provider = launch.launch_service_provider?.abbrev ?? launch.launch_service_provider?.name ?? '';

  return (
    <div className="countdown-view">
      <div className="countdown-view__stream-pane">
        <iframe
          src={stream.url}
          className="countdown-view__stream"
          title={stream.label}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <motion.div
          className="countdown-view__stream-scrim"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        />
      </div>

      <motion.div
        className="countdown-view__hud"
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.15, ease: HUD_DECEL }}
      >
        <div className="countdown-view__top">
          <div className="countdown-view__top-row">
            <span className="countdown-view__phase">{isTest ? 'TEST COUNTDOWN' : 'COUNTDOWN'}</span>
            <button className="countdown-view__close" onClick={onDismiss}>CLOSE ✕</button>
          </div>
          <span className="countdown-view__site">LIVE / {stream.label}</span>
        </div>

        <div className="countdown-view__mission">
          <span className="countdown-view__provider">{provider}</span>
          <span className="countdown-view__name">{launch.name}</span>
          <div className="countdown-view__pad-block">
            <span className="countdown-view__pad">{pad}</span>
            {location && <span className="countdown-view__location">{location}</span>}
          </div>
        </div>

        <div className={`countdown-view__clock-block countdown-view__clock-block--${band}`}>
          <span className="countdown-view__clock-label">T MINUS</span>
          <CountdownClock netTime={launch.net} className="countdown-view__clock" />
        </div>
      </motion.div>
    </div>
  );
}
