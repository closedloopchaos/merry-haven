import { useEffect, useState } from 'react';

// Stream catalog. id must match the site's streamId for sync.
// Vandenberg deliberately omitted — no dedicated stream exists.
const STREAMS = [
  { id: 'spacecoast', label: 'SPACE COAST', url: 'https://www.youtube.com/embed/Jm8wRjD3xVA?autoplay=1&mute=1' },
  { id: 'starbase',   label: 'STARBASE',    url: 'https://www.youtube.com/embed/mhJRzQsLZGg?autoplay=1&mute=1' },
  { id: 'mcgregor',   label: 'MCGREGOR',    url: 'https://www.youtube.com/embed/cOmmvhDQ2HM?autoplay=1&mute=1' },
];

// Which streams correspond to a site (and therefore re-sync the range panel)
const SITE_LINKED_STREAMS = new Set(['spacecoast', 'starbase']);

export default function CenterPanel({ launches, site, onSelectSite }) {
  const siteStreamId = site?.streamId ?? 'spacecoast';
  const [selectedId, setSelectedId] = useState(siteStreamId);

  // Follow the active site when it changes (one direction: site → stream)
  useEffect(() => { setSelectedId(siteStreamId); }, [siteStreamId]);

  const stream = STREAMS.find(s => s.id === selectedId) ?? STREAMS[0];

  function pickStream(id) {
    setSelectedId(id);
    // Reverse sync: stream tab that maps to a site also flips the site
    if (SITE_LINKED_STREAMS.has(id)) onSelectSite?.(id);
  }

  return (
    <div className="center-panel">
      <div className="center-panel__stream-tabs">
        {STREAMS.map(s => (
          <button
            key={s.id}
            className={`center-panel__stream-tab${selectedId === s.id ? ' is-active' : ''}`}
            onClick={() => pickStream(s.id)}
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
