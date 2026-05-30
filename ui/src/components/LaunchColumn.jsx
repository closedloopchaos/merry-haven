import CountdownClock from './CountdownClock.jsx';
import Logo from './Logo.jsx';

function extractPad(launch) {
  const name = launch.pad?.name;
  if (!name) return null;
  // Compact form already (e.g., "SLC-40", "LC-39A")
  let m = name.match(/\b(SLC|LC|LP|LZ|ELC|OLP)[- ]?(\d+[A-Z]?)\b/i);
  if (m) return `${m[1].toUpperCase()}-${m[2].toUpperCase()}`;
  // "Space Launch Complex 40" → SLC-40
  m = name.match(/space launch complex[\s-]+(\d+[A-Z]?)/i);
  if (m) return `SLC-${m[1].toUpperCase()}`;
  // "Launch Complex 39A" → LC-39A
  m = name.match(/launch complex[\s-]+(\d+[A-Z]?)/i);
  if (m) return `LC-${m[1].toUpperCase()}`;
  // "Orbital Launch Pad A" → OLP-A
  m = name.match(/orbital launch pad[\s-]+([A-Z\d]+)/i);
  if (m) return `OLP-${m[1].toUpperCase()}`;
  return name.split(',')[0].trim().toUpperCase().slice(0, 12);
}

const PROVIDER_LABELS = {
  SpX: 'SpaceX',
  SpaceX: 'SpaceX',
  ULA: 'ULA',
  'United Launch Alliance': 'ULA',
  RL: 'Rocket Lab',
  'Rocket Lab': 'Rocket Lab',
  NG: 'Northrop',
  'Northrop Grumman': 'Northrop',
  BO: 'Blue Origin',
  'Blue Origin': 'Blue Origin',
  Arianespace: 'Arianespace',
  CASC: 'CASC',
  ISRO: 'ISRO',
  JAXA: 'JAXA',
  Roscosmos: 'Roscosmos',
};

function providerLabel(launch) {
  const p = launch.launch_service_provider;
  if (!p) return '';
  return PROVIDER_LABELS[p.name] ?? PROVIDER_LABELS[p.abbrev] ?? p.abbrev ?? p.name ?? '';
}

const STATUS_META = {
  Go:          { label: 'GO',      cls: 'badge--go'     },
  TBD:         { label: 'TBD',     cls: 'badge--tbd'    },
  Hold:        { label: 'HOLD',    cls: 'badge--hold'   },
  Success:     { label: 'SUCC',    cls: 'badge--succ'   },
  Failure:     { label: 'FAIL',    cls: 'badge--fail'   },
  'In Flight': { label: 'LIFTOFF', cls: 'badge--flight' },
};

function relativeDay(net) {
  const ms = Date.parse(net) - Date.now();
  if (ms < 0) return null;
  const days = Math.floor(ms / 86_400_000);
  if (days === 0) return 'TODAY';
  if (days === 1) return 'TOMORROW';
  return `IN ${days}D`;
}

function formatNet(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });
  } catch { return null; }
}

export default function LaunchColumn({
  launches,
  loading,
  lastFetched,
  selectedId,
  onSelectLaunch,
  onOpenSettings,
  changedIds,
}) {
  const nextLaunch = launches[0] ?? null;
  const nextStatus = nextLaunch
    ? (STATUS_META[nextLaunch.status?.abbrev] ?? { label: '??', cls: 'badge--tbd' })
    : null;

  return (
    <div className="launch-col">
      <Logo onSettings={onOpenSettings} />

      {nextLaunch && (
        <div
          className={`launch-col__t0-hero${selectedId ? '' : ' is-active'}`}
          onClick={() => onSelectLaunch(null)}
          role="button"
          tabIndex={0}
        >
          <CountdownClock netTime={nextLaunch.net} className="launch-col__t0-clock" />
          <div className="launch-col__t0-name">{nextLaunch.name}</div>
          <div className="launch-col__t0-status">
            <span className={`badge badge--lg ${nextStatus.cls}`}>{nextStatus.label}</span>
            {formatNet(nextLaunch.net) && (
              <span className="launch-col__t0-net">{formatNet(nextLaunch.net)}</span>
            )}
          </div>
        </div>
      )}

      <div className="launch-col__list">
        {loading && launches.length === 0 && <div className="panel-note">FETCHING</div>}
        {!loading && launches.length === 0 && <div className="panel-note">NO LAUNCHES SCHEDULED</div>}
        {launches.slice(1).map((l, i) => {
          const { label, cls } = STATUS_META[l.status?.abbrev] ?? { label: '??', cls: 'badge--tbd' };
          const dayLabel = relativeDay(l.net);
          const padLabel = extractPad(l);
          const prob = l.probability != null && l.probability > 0 ? l.probability : null;
          const isSelected = l.id === selectedId;
          const isChanged  = changedIds?.has(l.id);
          return (
            <button
              key={l.id}
              className={[
                'launch-col__item',
                isSelected ? 'is-selected' : '',
                isChanged ? 'is-changed' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onSelectLaunch(isSelected ? null : l.id)}
            >
              <div className="launch-col__row">
                <span className="launch-col__provider">
                  {providerLabel(l)}
                  {padLabel && <span className="launch-col__pad"> · {padLabel}</span>}
                </span>
                <span className={`badge ${cls}`}>{label}</span>
              </div>
              <div className="launch-col__name">{l.name}</div>
              <div className="launch-col__row launch-col__row--bottom">
                <span className="launch-col__bottom-left">
                  {dayLabel && <span className="launch-col__day">{dayLabel}</span>}
                  {prob != null && (
                    <span className={`launch-col__prob${prob >= 80 ? ' launch-col__prob--high' : ''}`}>
                      {prob}%
                    </span>
                  )}
                </span>
                <CountdownClock netTime={l.net} className="launch-list__countdown" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
