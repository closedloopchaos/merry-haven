import CountdownClock from './CountdownClock.jsx';

const STATUS_META = {
  Go:          { label: 'GO FOR LAUNCH', cls: 'badge--go'     },
  TBD:         { label: 'TBD',           cls: 'badge--tbd'    },
  Hold:        { label: 'HOLD',          cls: 'badge--hold'   },
  Success:     { label: 'SUCCESS',       cls: 'badge--succ'   },
  Failure:     { label: 'FAILURE',       cls: 'badge--fail'   },
  'In Flight': { label: 'IN FLIGHT',     cls: 'badge--flight' },
};

function formatNet(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });
  } catch { return iso; }
}

function pickPatch(launch) {
  const patches = launch.mission_patches ?? [];
  if (!patches.length) return null;
  const sorted = [...patches].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  return sorted[0]?.image_url ?? null;
}

function primaryBooster(launch) {
  return launch.rocket?.launcher_stage?.[0] ?? null;
}

function pickCustomer(launch) {
  const provider = launch.launch_service_provider?.id;
  const agencies = launch.mission?.agencies ?? [];
  const customer = agencies.find(a => a.id !== provider) ?? agencies[0] ?? null;
  return customer?.abbrev ?? customer?.name ?? null;
}

function buildFootnotes(launch) {
  const notes = [];
  const booster = primaryBooster(launch);
  if (booster?.launcher?.serial_number) {
    const launcher = booster.launcher;
    const parts = [`Booster ${launcher.serial_number}`];
    if (booster.launcher_flight_number) parts.push(`flight ${booster.launcher_flight_number} of ${launcher.flights ?? '?'}`);
    if (launcher.successful_landings != null) parts.push(`${launcher.successful_landings} successful landings`);
    if (booster.turn_around_time_days != null) parts.push(`${booster.turn_around_time_days}-day turnaround`);
    notes.push(parts.join(' · '));
  }
  if (booster?.landing?.location?.name) {
    const landing = booster.landing;
    notes.push(`Recovery target: ${landing.location.name}${landing.location.abbrev ? ` (${landing.location.abbrev})` : ''}`);
  }
  if (launch.probability != null && launch.probability >= 0) {
    notes.push(`Weather GO probability: ${launch.probability}%`);
  }
  const customer = pickCustomer(launch);
  if (customer) {
    notes.push(`Customer: ${customer}`);
  }
  if (launch.pad?.location?.name) {
    notes.push(`Range: ${launch.pad.location.name}`);
  }
  return notes;
}

export default function LaunchDetail({ launch, launches = [], onClose }) {
  if (!launch) return null;

  const provider     = launch.launch_service_provider?.name ?? '';
  const abbrev       = launch.launch_service_provider?.abbrev ?? provider;
  const rocket       = launch.rocket?.configuration?.full_name ?? launch.rocket?.configuration?.name ?? '—';
  const pad          = launch.pad?.name ?? '—';
  const location     = launch.pad?.location?.name ?? '';
  const statusAbbrev = launch.status?.abbrev ?? '';
  const missionType  = launch.mission?.type ?? '';
  const orbit        = launch.mission?.orbit?.abbrev ?? '';
  const description  = launch.mission?.description ?? '';
  const vidUrls      = launch.vid_urls ?? [];
  const { label: statusLabel, cls: statusCls } = STATUS_META[statusAbbrev] ?? { label: statusAbbrev || '??', cls: 'badge--tbd' };

  const patchUrl = pickPatch(launch);
  const footnotes = buildFootnotes(launch);

  return (
    <div className="launch-detail editorial">
      <div className="editorial__masthead">
        <button className="editorial__close" onClick={onClose}>CLOSE ✕</button>
      </div>

      <div className="editorial__body">
        <div className="editorial__headline-row">
          {patchUrl && (
            <img src={patchUrl} alt="Mission patch" className="editorial__patch" />
          )}
          <div className="editorial__headline-block">
            <h1 className="editorial__headline">{launch.name}</h1>
            <div className="editorial__byline">
              <span>{abbrev}</span>
              <span className="editorial__byline-sep">·</span>
              <span>{rocket}</span>
              <span className="editorial__byline-sep">·</span>
              <span className={`badge ${statusCls}`}>{statusLabel}</span>
            </div>
          </div>
        </div>

        <hr className="editorial__rule" />

        <div className="editorial__clock-row">
          <CountdownClock netTime={launch.net} className="editorial__clock" />
          <div className="editorial__pad-block">
            <span className="editorial__pad">{pad}</span>
            {location && <span className="editorial__location">{location}</span>}
          </div>
        </div>

        {description && (
          <>
            <hr className="editorial__rule" />
            <p className="editorial__lede">
              {description}
              {footnotes.length > 0 && (
                <sup className="editorial__footmark">{footnotes.map((_, i) => i + 1).join(',')}</sup>
              )}
            </p>
          </>
        )}

        {footnotes.length > 0 && (
          <>
            <hr className="editorial__rule" />
            <ol className="editorial__footnotes">
              {footnotes.map((note, i) => (
                <li key={i}>
                  <span className="editorial__footnote-num">{i + 1}</span>
                  <span>{note}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        <hr className="editorial__rule" />

        <dl className="editorial__specs">
          {missionType && (<><dt>TYPE</dt><dd>{missionType}</dd></>)}
          {orbit       && (<><dt>ORBIT</dt><dd>{orbit}</dd></>)}
          <dt>NET</dt><dd>{formatNet(launch.net)}</dd>
          <dt>PROVIDER</dt><dd>{provider}</dd>
        </dl>

        {vidUrls.length > 0 && (
          <>
            <hr className="editorial__rule" />
            <div className="editorial__webcast">
              <span className="editorial__webcast-label">WEBCAST</span>
              {vidUrls.map((v, i) => (
                <a key={i} href={v.url} target="_blank" rel="noreferrer" className="editorial__webcast-link">
                  → {v.title || v.url}
                </a>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
