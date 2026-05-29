import CountdownClock from './CountdownClock.jsx';
import Logo from './Logo.jsx';

function extractPad(launch) {
  const name = launch.pad?.name;
  if (!name) return null;
  const m = name.match(/\b(SLC|LC|LP|LZ)[- ]?(\d+[A-Z]?)\b/i);
  if (m) return `${m[1].toUpperCase()}-${m[2].toUpperCase()}`;
  return name.split(',')[0].trim().toUpperCase().slice(0, 12);
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
            {lastFetched && <span className="panel-header__fetched">{lastFetched}</span>}
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
                  {l.launch_service_provider?.abbrev ?? l.launch_service_provider?.name}
                </span>
                <span className={`badge ${cls}`}>{label}</span>
              </div>
              <div className="launch-col__name">{l.name}</div>
              <div className="launch-col__row launch-col__row--meta">
                {padLabel && <span className="launch-col__pad">{padLabel}</span>}
                {prob != null && (
                  <span className={`launch-col__prob${prob >= 80 ? ' launch-col__prob--high' : ''}`}>
                    {prob}%
                  </span>
                )}
              </div>
              <div className="launch-col__row launch-col__row--bottom">
                {dayLabel && <span className="launch-col__day">{dayLabel}</span>}
                <CountdownClock netTime={l.net} className="launch-list__countdown" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
