import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// In-memory cache: key -> { data, timestamp }
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

// Space Coast: location 12 = CCSFS, location 27 = KSC
const LL2_URL =
  'https://ll.thespacedevs.com/2.2.0/launch/upcoming/' +
  '?location__ids=12,27&limit=10&mode=detailed';

const NWS_OBS_URL = 'https://api.weather.gov/stations/KXMR/observations/latest';
const NWS_FORECAST_URL = 'https://api.weather.gov/gridpoints/MLB/56,65/forecast/hourly';

const NWS_HEADERS = { Accept: 'application/geo+json' };

const SFN_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=15&ordering=-published_at';

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
    const [observation, forecast] = await Promise.all([
      fetchCached('weather-obs', NWS_OBS_URL, 15 * 60 * 1000, NWS_HEADERS),
      fetchCached('weather-forecast', NWS_FORECAST_URL, 15 * 60 * 1000, NWS_HEADERS),
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
