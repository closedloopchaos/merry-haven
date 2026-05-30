import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const cache = new Map();

function isFresh(key, ttlMs) {
  const entry = cache.get(key);
  return entry ? Date.now() - entry.timestamp < ttlMs : false;
}

async function fetchCached(key, url, ttlMs, headers = {}) {
  if (isFresh(key, ttlMs)) return cache.get(key).data;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  let res;
  try {
    res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'MerryHaven/1.0 (launch-dashboard)', ...headers },
    });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`Upstream ${res.status} from ${url}`);
  const data = await res.json();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

// LL2 location IDs: 11 Vandenberg · 12 CCSFS · 27 KSC · 143 SpaceX South Texas
const LL2_URL =
  'https://ll.thespacedevs.com/2.2.0/launch/upcoming/' +
  '?location__ids=11,12,27,143&limit=15&mode=detailed';

const SFN_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=15&ordering=-published_at';

const NWS_HEADERS = { Accept: 'application/geo+json' };
const DEFAULT_STATION = 'KXMR';
// Fallback forecast for Space Coast when no lat/lon is given
const DEFAULT_FORECAST_URL = 'https://api.weather.gov/gridpoints/MLB/56,65/forecast/hourly';

// Resolve a lat/lon to its NWS hourly-forecast URL via the /points endpoint.
// /points data is essentially static — cache 24h.
async function resolveForecastUrl(lat, lon) {
  const key = `points-${lat}-${lon}`;
  const data = await fetchCached(
    key,
    `https://api.weather.gov/points/${lat},${lon}`,
    24 * 60 * 60 * 1000,
    NWS_HEADERS,
  );
  return data?.properties?.forecastHourly ?? null;
}

app.get('/api/launches', async (req, res) => {
  try {
    const data = await fetchCached('launches', LL2_URL, 5 * 60 * 1000);
    res.json(data);
  } catch (err) {
    console.error('launches fetch failed:', err.message);
    res.status(502).json({ error: err.message });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const station = (req.query.station ?? DEFAULT_STATION).toString();
    const lat = req.query.lat?.toString();
    const lon = req.query.lon?.toString();

    const obsUrl = `https://api.weather.gov/stations/${station}/observations/latest`;
    const obsKey = `weather-obs-${station}`;

    let forecastUrl = DEFAULT_FORECAST_URL;
    let forecastKey = 'weather-forecast-default';
    if (lat && lon) {
      const resolved = await resolveForecastUrl(lat, lon);
      if (resolved) {
        forecastUrl = resolved;
        forecastKey = `weather-forecast-${lat}-${lon}`;
      }
    }

    const [observation, forecast] = await Promise.all([
      fetchCached(obsKey, obsUrl, 15 * 60 * 1000, NWS_HEADERS),
      fetchCached(forecastKey, forecastUrl, 15 * 60 * 1000, NWS_HEADERS),
    ]);
    res.json({ observation, forecast });
  } catch (err) {
    console.error('weather fetch failed:', err.message);
    res.status(502).json({ error: err.message });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const data = await fetchCached('news', SFN_URL, 10 * 60 * 1000);
    res.json(data);
  } catch (err) {
    console.error('news fetch failed:', err.message);
    res.status(502).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(3001, () => console.log('Merry Haven API listening on :3001'));
