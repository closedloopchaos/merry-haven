import { useEffect, useState } from 'react';

const STREAMS = [
  { id: 'spacecoast', label: 'SPACE COAST', url: 'https://www.youtube.com/embed/Jm8wRjD3xVA?autoplay=1&mute=1' },
  { id: 'starbase',   label: 'STARBASE',    url: 'https://www.youtube.com/embed/mhJRzQsLZGg?autoplay=1&mute=1' },
  { id: 'vandenberg', label: 'VANDENBERG',  url: 'https://www.youtube.com/embed/21X5lGlDOfg?autoplay=1&mute=1' },
  { id: 'mcgregor',   label: 'MCGREGOR',    url: 'https://www.youtube.com/embed/cOmmvhDQ2HM?autoplay=1&mute=1' },
];

export default function CenterPanel({ launches, site }) {
  const siteStreamId = site?.streamId ?? 'spacecoast';
  const [selectedId, setSelectedId] = useState(siteStreamId);

  // Follow the active site when it changes — until user manually picks a different stream
  useEffect(() => { setSelectedId(siteStreamId); }, [siteStreamId]);

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
