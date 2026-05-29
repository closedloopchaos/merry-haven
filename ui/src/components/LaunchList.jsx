import CountdownClock from './CountdownClock.jsx';

const STATUS_META = {
  Go:            { label: 'GO',     cls: 'badge--go'     },
  TBD:           { label: 'TBD',    cls: 'badge--tbd'    },
  Hold:          { label: 'HOLD',   cls: 'badge--hold'   },
  Success:       { label: 'SUCC',   cls: 'badge--succ'   },
  Failure:       { label: 'FAIL',   cls: 'badge--fail'   },
  'In Flight':   { label: 'LIFTOFF',cls: 'badge--flight' },
};

function statusMeta(abbrev) {
  return STATUS_META[abbrev] ?? { label: abbrev ?? '??', cls: 'badge--tbd' };
}

function relativeDay(net) {
  const ms = Date.parse(net) - Date.now();
  if (ms < 0) return null;
  const days = Math.floor(ms / 86_400_000);
  if (days === 0) return 'TODAY';
  if (days === 1) return 'TOMORROW';
  return `IN ${days}D`;
}

export default function LaunchList({ launches, loading, selectedId, onSelect, lastFetched }) {
  if (loading) {
    return (
      <div className="launch-list">
        <div className="panel-header">[ SPACE COAST ]</div>
        <div className="panel-note">fetching launches…</div>
      </div>
    );
  }

  if (!launches.length) {
    return (
      <div className="launch-list">
        <div className="panel-header">[ SPACE COAST ]</div>
        <div className="panel-note">no upcoming launches</div>
      </div>
    );
  }

  return (
    <div className="launch-list">
      <div className="panel-header">
        [ SPACE COAST ]
        {lastFetched && <span className="panel-header__fetched"> · {lastFetched}</span>}
      </div>
      {launches.map((l, i) => {
        const dayLabel = relativeDay(l.net);
        const { label, cls } = statusMeta(l.status?.abbrev);
        const isNext = i === 0;
        const isSelected = l.id === selectedId;

        return (
          <button
            key={l.id}
            className={`launch-list__item ${isNext ? 'launch-list__item--next' : ''} ${isSelected ? 'launch-list__item--selected' : ''}`}
            onClick={() => onSelect(isSelected ? null : l)}
          >
            <div className="launch-list__body">
              <div className="launch-list__row launch-list__row--top">
                <span className="launch-list__provider">
                  {l.launch_service_provider?.abbrev ?? l.launch_service_provider?.name}
                </span>
                <span className={`badge ${cls}`}>[{label}]</span>
              </div>
              <div className="launch-list__name">{l.name}</div>
              <div className="launch-list__row launch-list__row--bottom">
                <span className="launch-list__pad">{l.pad?.name}</span>
                <CountdownClock netTime={l.net} className="launch-list__countdown" />
              </div>
              {dayLabel && (
                <div className="launch-list__day">{dayLabel}</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
