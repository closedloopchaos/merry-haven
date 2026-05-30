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

function pickCustomer(launch) {
  const provider = launch.launch_service_provider?.id;
  const agencies = launch.mission?.agencies ?? [];
  const customer = agencies.find(a => a.id !== provider) ?? agencies[0] ?? null;
  return customer?.abbrev ?? customer?.name ?? null;
}

function buildSpecs(launch) {
  const specs = [];
  const missionType = launch.mission?.type;
  const orbit       = launch.mission?.orbit?.abbrev;
  if (missionType) specs.push(['TYPE',     missionType]);
  if (orbit)       specs.push(['ORBIT',    orbit]);
  specs.push(['NET', formatNet(launch.net)]);

  const stage = launch.rocket?.launcher_stage?.[0];
  if (stage?.launcher?.serial_number) {
    const parts = [stage.launcher.serial_number];
    if (stage.launcher_flight_number) parts.push(`F${stage.launcher_flight_number}`);
    specs.push(['BOOSTER', parts.join(' · ')]);
  }
  if (stage?.landing?.location?.abbrev) {
    specs.push(['RECOVERY', stage.landing.location.abbrev]);
  }
  if (launch.probability != null && launch.probability >= 0) {
    specs.push(['WX GO', `${launch.probability}%`]);
  }
  const customer = pickCustomer(launch);
  if (customer) specs.push(['CUSTOMER', customer]);

  return specs;
}

export default function LaunchDetail({ launch }) {
  if (!launch) return null;

  const abbrev      = launch.launch_service_provider?.abbrev ?? launch.launch_service_provider?.name ?? '';
  const rocket      = launch.rocket?.configuration?.full_name ?? launch.rocket?.configuration?.name ?? '—';
  const pad         = launch.pad?.name ?? '—';
  const location    = launch.pad?.location?.name ?? '';
  const statusAbbrev = launch.status?.abbrev ?? '';
  const description = launch.mission?.description ?? '';
  const vidUrls     = launch.vid_urls ?? [];
  const { label: statusLabel, cls: statusCls } = STATUS_META[statusAbbrev] ?? { label: statusAbbrev || '??', cls: 'badge--tbd' };

  const patchUrl = pickPatch(launch);
  const specs    = buildSpecs(launch);
  const isCrewed = launch.rocket?.configuration?.human_rated === true
    || launch.mission?.type === 'Human Exploration';

  return (
    <div className="launch-detail editorial">
      <div className="editorial__body">

        {isCrewed && <div className="editorial__crewed">CREWED</div>}

        {patchUrl && (
          <div className="editorial__patch-hero">
            <img src={patchUrl} alt="Mission patch" />
          </div>
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
            <p className="editorial__lede">{description}</p>
          </>
        )}

        <hr className="editorial__rule" />

        <dl className="editorial__specs">
          {specs.flatMap(([label, value]) => [
            <dt key={`${label}-k`}>{label}</dt>,
            <dd key={`${label}-v`}>{value}</dd>,
          ])}
        </dl>

        {vidUrls.length > 0 && (
          <>
            <hr className="editorial__rule" />
            <div className="editorial__webcast">
              <span className="editorial__webcast-label">WEBCAST</span>
              <a href={vidUrls[0].url} target="_blank" rel="noreferrer" className="editorial__webcast-link">
                → {vidUrls[0].title || vidUrls[0].url}
              </a>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
