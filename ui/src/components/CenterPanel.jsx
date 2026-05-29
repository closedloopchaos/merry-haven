import { useState } from 'react';

const STREAMS = [
  { id: 'spacecoast', label: 'SPACE COAST', url: 'https://www.youtube.com/embed/Jm8wRjD3xVA?autoplay=1&mute=1' },
  { id: 'starbase',   label: 'STARBASE',    url: 'https://www.youtube.com/embed/mhJRzQsLZGg?autoplay=1&mute=1' },
  { id: 'mcgregor',   label: 'MCGREGOR',    url: 'https://www.youtube.com/embed/cOmmvhDQ2HM?autoplay=1&mute=1' },
];

function autoSelectStream(launches) {
  const next = launches[0];
  if (!next) return 'spacecoast';
  const loc = (next.pad?.location?.name ?? '').toLowerCase();
  const pad = (next.pad?.name ?? '').toLowerCase();
  if (loc.includes('boca chica') || loc.includes('starbase') || pad.includes('starbase')) return 'starbase';
  if (loc.includes('mcgregor')) return 'mcgregor';
  return 'spacecoast';
}

export default function CenterPanel({ launches }) {
  const [selectedId, setSelectedId] = useState(() => autoSelectStream(launches));
  const stream = STREAMS.find(s => s.id === selectedId) ?? STREAMS[0];

  return (
    <div className="center-panel">
      <div className="center-panel__stream-tabs">
        {STREAMS.map(s => (
          <button
            key={s.id}
            className={`center-panel__stream-tab${selectedId === s.id ? ' is-active' : ''}`}
            onClick={() => setSelectedId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <iframe
        key={selectedId}
        src={stream.url}
        className="center-panel__stream"
        title={stream.label}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
