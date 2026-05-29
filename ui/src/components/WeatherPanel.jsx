import { useState } from 'react';
import RadarMap from './RadarMap.jsx';
import PadMap from './PadMap.jsx';
import LaunchTimeline from './LaunchTimeline.jsx';

const CARDINALS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

function degToCardinal(deg) {
  if (deg == null) return '—';
  return CARDINALS[Math.round(deg / 22.5) % 16];
}

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  } catch { return ''; }
}

export default function WeatherPanel({ weather, launches = [], selectedLaunch }) {
  const [activeTab, setActiveTab] = useState(() => {
    try { return localStorage.getItem('mh-range-tab') || 'forecast'; } catch { return 'forecast'; }
  });

  function selectTab(t) {
    setActiveTab(t);
    try { localStorage.setItem('mh-range-tab', t); } catch {}
  }

  if (!weather) {
    return (
      <div className="weather-panel">
        <div className="panel-header">RANGE</div>
        <div className="panel-note">FETCHING</div>
      </div>
    );
  }

  const { temperature, dewPoint, windSpeed, windDirection, windGust, visibility, relativeHumidity, textDescription, periods, obsTime } = weather;

  const t0Ms = launches[0]?.net ? Date.parse(launches[0].net) : null;
  const isNearTerm = t0Ms != null && (t0Ms - Date.now()) < 12 * 3600 * 1000 && (t0Ms - Date.now()) > 0;
  const t0PeriodIdx = isNearTerm
    ? periods.slice(0, 6).reduce((best, p, i) => {
        const d = Math.abs(Date.parse(p.startTime) - t0Ms);
        return d < best.d ? { i, d } : best;
      }, { i: -1, d: Infinity }).i
    : -1;

  return (
    <div className="weather-panel">
      <div className="panel-header">
        RANGE
        {obsTime && <span className="panel-header__fetched">OBS {obsTime}</span>}
      </div>

      <div className="weather-panel__tabs">
        <button
          className={`weather-panel__tab ${activeTab === 'forecast' ? 'is-active' : ''}`}
          onClick={() => selectTab('forecast')}
        >
          FORECAST
        </button>
        <button
          className={`weather-panel__tab ${activeTab === 'radar' ? 'is-active' : ''}`}
          onClick={() => selectTab('radar')}
        >
          RADAR
        </button>
        <button
          className={`weather-panel__tab ${activeTab === 'timeline' ? 'is-active' : ''}`}
          onClick={() => selectTab('timeline')}
        >
          TIMELINE
        </button>
        <button
          className={`weather-panel__tab ${activeTab === 'pads' ? 'is-active' : ''}`}
          onClick={() => selectTab('pads')}
        >
          PADS
        </button>
      </div>

      <div className="weather-panel__body">
        {activeTab === 'forecast' && (
          <>
            {/* Wind block */}
            <div className="weather-panel__wind-block">
              <div
                className="weather-panel__wind-arrow"
                style={{ transform: `rotate(${windDirection ?? 0}deg)` }}
                title={`From ${degToCardinal(windDirection)} (${windDirection ?? '—'}°)`}
              >
                ↑
              </div>
              <div className="weather-panel__wind-data">
                <div className="weather-panel__wind-row">
                  <span className="weather-panel__wind-lbl">WIND</span>
                  <span className="weather-panel__wind-speed">{windSpeed != null ? `${windSpeed} mph` : '—'}</span>
                  <span className="weather-panel__wind-dir">{degToCardinal(windDirection)}</span>
                </div>
                {windGust != null && (
                  <div className="weather-panel__wind-row">
                    <span className="weather-panel__wind-lbl">GUST</span>
                    <span className="weather-panel__wind-gust">{windGust} mph</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="weather-panel__stats">
              <div className="weather-panel__stat">
                <label>TEMP</label>
                <span>{temperature != null ? `${temperature}°F` : '—'}</span>
              </div>
              <div className="weather-panel__stat">
                <label>VISIBILITY</label>
                <span>{visibility != null ? `${visibility} mi` : '—'}</span>
              </div>
              <div className="weather-panel__stat">
                <label>HUMIDITY</label>
                <span>{relativeHumidity != null ? `${relativeHumidity}%` : '—'}</span>
              </div>
              <div className="weather-panel__stat">
                <label>DEW PT</label>
                <span>{dewPoint != null ? `${dewPoint}°F` : '—'}</span>
              </div>
              <div className="weather-panel__stat weather-panel__stat--wide">
                <label>CONDITIONS</label>
                <span>{textDescription || '—'}</span>
              </div>
            </div>

            {/* Hourly forecast strip */}
            {periods.length > 0 && (
              <>
                <div className="weather-panel__section-label">HOURLY</div>
                <div className="weather-panel__forecast">
                  {periods.slice(0, 6).map((p, i) => (
                    <div key={i} className={`weather-panel__forecast-cell${i === t0PeriodIdx ? ' is-t0' : ''}`}>
                      {i === t0PeriodIdx && <div className="weather-panel__forecast-t0">T0</div>}
                      <div className="weather-panel__forecast-time">{formatTime(p.startTime)}</div>
                      <div className="weather-panel__forecast-temp">{p.temperature}°</div>
                      <div className="weather-panel__forecast-wind">{p.windSpeed}</div>
                      <div className="weather-panel__forecast-sky">{p.shortForecast.split(' ').slice(0, 2).join(' ')}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* SLD-45 launch forecast button (anchored at bottom) */}
            <a
              href="https://45thweathersquadron.nebula.spaceforce.mil/pages/launchForecastSupport.html"
              target="_blank"
              rel="noreferrer"
              className="weather-panel__sld45-btn"
            >
              OPEN SLD-45 WEATHER FORECAST
            </a>
          </>
        )}

        {activeTab === 'radar' && (
          <>
            <div className="weather-panel__section-label">RADAR / KMLB</div>
            <RadarMap />
          </>
        )}

        {activeTab === 'timeline' && (
          <LaunchTimeline launch={selectedLaunch || launches[0]} />
        )}

        {activeTab === 'pads' && (
          <PadMap launches={launches} />
        )}
      </div>
    </div>
  );
}
