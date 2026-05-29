import CountdownClock from './CountdownClock.jsx';

const STATUS_CLASSES = {
  Go: 'status--go',
  TBD: 'status--tbd',
  Hold: 'status--hold',
  Success: 'status--success',
  Failure: 'status--failure',
};

export default function LaunchExpanded({ launch, onDismiss }) {
  if (!launch) return null;

  const provider = launch.launch_service_provider?.name ?? '';
  const abbrev = launch.launch_service_provider?.abbrev ?? '';
  const rocket = launch.rocket?.configuration?.full_name ?? launch.rocket?.configuration?.name ?? '';
  const pad = launch.pad?.name ?? '';
  const location = launch.pad?.location?.name ?? '';
  const statusName = launch.status?.name ?? '';
  const statusAbbrev = launch.status?.abbrev ?? '';
  const description = launch.mission?.description ?? '';
  const missionType = launch.mission?.type ?? '';
  const orbit = launch.mission?.orbit?.abbrev ?? '';

  return (
    <div className="launch-expanded">
      <div className="launch-expanded__topbar">
        <div className="launch-expanded__provider-block">
          {launch.launch_service_provider?.logo_url && (
            <img
              src={launch.launch_service_provider.logo_url}
              alt={abbrev}
              className="launch-expanded__logo"
            />
          )}
          <div className="launch-expanded__provider-info">
            <span className="launch-expanded__provider">{provider}</span>
            <span className="launch-expanded__rocket">{rocket}</span>
          </div>
        </div>
        <div className="launch-expanded__status-block">
          <span className={`launch-expanded__status ${STATUS_CLASSES[statusAbbrev] ?? 'status--tbd'}`}>
            {statusName}
          </span>
          {missionType && <span className="launch-expanded__mission-type">{missionType}</span>}
          {orbit && <span className="launch-expanded__orbit">{orbit}</span>}
        </div>
        <button className="launch-expanded__dismiss" onClick={onDismiss} title="Close">
          CLOSE ✕
        </button>
      </div>

      <div className="launch-expanded__name">{launch.name}</div>

      <div className="launch-expanded__clock-row">
        <CountdownClock netTime={launch.net} className="launch-expanded__clock" />
        <div className="launch-expanded__pad">
          <span className="launch-expanded__pad-name">{pad}</span>
          {location && <span className="launch-expanded__location">{location}</span>}
        </div>
      </div>

      {description && (
        <p className="launch-expanded__description">{description}</p>
      )}
    </div>
  );
}
