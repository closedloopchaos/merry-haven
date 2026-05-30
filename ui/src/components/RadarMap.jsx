function buildWindyUrl(lat, lon, zoom) {
  return (
    'https://embed.windy.com/embed2.html' +
    `?lat=${lat}&lon=${lon}&zoom=${zoom}&level=surface` +
    '&overlay=radar&product=radar' +
    '&menu=&message=&marker=&calendar=now&pressure=' +
    '&type=map&location=coordinates&detail=' +
    '&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1'
  );
}

export default function RadarMap({ site }) {
  const lat = site?.radarLat ?? 28.39;
  const lon = site?.radarLon ?? -80.61;
  const zoom = site?.radarZoom ?? 7;
  const label = site?.label ?? 'SPACE COAST';

  return (
    <iframe
      key={`${lat}-${lon}-${zoom}`}
      src={buildWindyUrl(lat, lon, zoom)}
      className="radar-embed"
      title={`Radar — ${label}`}
      frameBorder="0"
    />
  );
}
