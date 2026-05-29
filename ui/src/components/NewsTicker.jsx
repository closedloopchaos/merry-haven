import { useNews } from '../hooks/useNews.js';
import { getOnThisDay } from '../data/onThisDay.js';

export default function NewsTicker() {
  const { articles } = useNews();
  const fact = getOnThisDay();

  // First item is the "on this day" almanac fact (not a link)
  // Followed by the news articles (links)
  const newsItems = articles.slice(0, 12).map(a => ({
    kind: 'news',
    source: a.news_site,
    text: a.title,
    url: a.url,
  }));

  const almanacItem = fact
    ? { kind: 'almanac', source: 'ON THIS DAY', text: fact }
    : null;

  const items = almanacItem ? [almanacItem, ...newsItems] : newsItems;

  if (items.length === 0) {
    return <div className="news-ticker" />;
  }

  const renderItem = (item, idx) => {
    const inner = (
      <span className="news-ticker__item">
        <span className={`news-ticker__source ${item.kind === 'almanac' ? 'news-ticker__source--almanac' : ''}`}>
          {item.source}
        </span>
        <span className="news-ticker__text">{item.text}</span>
      </span>
    );
    const sep = <span className="news-ticker__sep">///</span>;

    if (item.url) {
      return (
        <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="news-ticker__group">
          {inner}{sep}
        </a>
      );
    }
    return (
      <span key={idx} className="news-ticker__group news-ticker__group--static">
        {inner}{sep}
      </span>
    );
  };

  return (
    <div className="news-ticker">
      <div className="news-ticker__track">
        {items.map(renderItem)}
        {items.map((it, i) => renderItem(it, i + items.length))}
      </div>
    </div>
  );
}
