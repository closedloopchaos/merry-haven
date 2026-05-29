const SRC =
  'https://embed.windy.com/embed2.html' +
  '?lat=28.39&lon=-80.61&zoom=7&level=surface' +
  '&overlay=radar&product=radar' +
  '&menu=&message=&marker=&calendar=now&pressure=' +
  '&type=map&location=coordinates&detail=' +
  '&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1';

export default function RadarMap() {
  return (
    <iframe
      src={SRC}
      className="radar-embed"
      title="Radar — Cape Canaveral"
      frameBorder="0"
    />
  );
}
