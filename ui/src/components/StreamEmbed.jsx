function toEmbedUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    // youtu.be/ID
    if (url.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${url.pathname}?autoplay=1`;
    }
    // youtube.com/watch?v=ID
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      // already an embed URL
      if (url.pathname.startsWith('/embed/')) return rawUrl;
    }
  } catch {}
  return null;
}

export default function StreamEmbed({ launch }) {
  const vidUrls = launch?.vid_urls ?? [];
  const ytEntry = vidUrls.find(v =>
    v.url?.includes('youtube') || v.url?.includes('youtu.be')
  );
  const embedUrl = toEmbedUrl(ytEntry?.url);

  if (!embedUrl) {
    const anyUrl = vidUrls[0];
    return (
      <div className="stream-embed stream-embed--unavailable">
        <div className="stream-embed__placeholder">
          <span className="stream-embed__label">WEBCAST</span>
          <span className="stream-embed__note">
            {vidUrls.length === 0
              ? 'Stream not yet announced'
              : 'Non-YouTube stream detected'}
          </span>
          {anyUrl?.url && (
            <a
              href={anyUrl.url}
              target="_blank"
              rel="noreferrer"
              className="stream-embed__link"
            >
              Open stream ↗
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="stream-embed">
      <iframe
        src={embedUrl}
        title={`${launch?.name ?? 'Launch'} Stream`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
