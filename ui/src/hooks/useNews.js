import { useState, useEffect } from 'react';

const LAUNCH_KEYWORDS = [
  'launch','rocket','mission','pad','liftoff','countdown','booster','landing','recovery',
  'falcon','starship','dragon','crew','starlink','kuiper','vulcan','electron','firefly',
  'spacex','nasa','ula','boeing','rocketlab','rocket lab','blue origin','blueorigin','new glenn','new shepard',
  'kennedy','cape canaveral','vandenberg','boca chica','starbase','sld-45','ksc','vsfb',
  'lc-','slc-','t-minus','t minus',
  'scrub','delay','static fire','wet dress','net ',
  'payload','spacecraft','satellite','orbital','orbit','leo','geo','gto','tli','iss',
];

function isLaunchRelevant(article) {
  const text = `${article.title ?? ''} ${article.summary ?? ''}`.toLowerCase();
  return LAUNCH_KEYWORDS.some(kw => text.includes(kw));
}

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [lastFetched, setLastFetched] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const all = data.results ?? [];
        const filtered = all.filter(isLaunchRelevant);
        // Fall back to unfiltered if the filter wiped everything out
        const source = filtered.length > 0 ? filtered : all;
        const mapped = source.map(a => ({
          title: a.title,
          news_site: a.news_site,
          url: a.url,
        }));
        setArticles(mapped);
        setLastFetched(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      } catch {
        // non-critical — ticker keeps showing previous content
      }
    }

    fetchNews();
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { articles, lastFetched };
}
