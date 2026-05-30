// Stream catalog keyed by site streamId. The site toggle in WeatherPanel
// is the single control — this component just renders whichever stream
// the active site points to.
const STREAMS = {
  spacecoast: { label: 'SPACE COAST', url: 'https://www.youtube.com/embed/Jm8wRjD3xVA?autoplay=1&mute=1' },
  starbase:   { label: 'STARBASE',    url: 'https://www.youtube.com/embed/mhJRzQsLZGg?autoplay=1&mute=1' },
};

export default function CenterPanel({ site }) {
  const streamId = site?.streamId ?? null;
  const stream = streamId ? STREAMS[streamId] : null;

  if (!stream) {
    return (
      <div className="center-panel">
        <div className="center-panel__no-stream">
          <span className="center-panel__no-stream-label">LIVE</span>
          <span className="center-panel__no-stream-site">{site?.label ?? ''}</span>
          <span className="center-panel__no-stream-note">NO WEBCAST AVAILABLE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="center-panel">
      <div className="center-panel__stream-label">LIVE / {stream.label}</div>
      <iframe
        key={streamId}
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
