// Vertical editorial list — each milestone as a stacked row, never compresses.

function formatT(seconds) {
  const sign = seconds < 0 ? '-' : '+';
  const abs = Math.abs(seconds);
  const m = Math.floor(abs / 60);
  const s = Math.floor(abs % 60);
  return `T${sign}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TimelineList({ timeline, activeIdx, selectedIdx, onHover, onClick }) {
  return (
    <ol className="timeline-list">
      {timeline.milestones.map((m, i) => {
        const isActive   = activeIdx === i;
        const isSelected = selectedIdx === i;
        return (
          <li
            key={i}
            className={[
              'timeline-list__row',
              isActive ? 'is-active' : '',
              isSelected ? 'is-selected' : '',
            ].filter(Boolean).join(' ')}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(i)}
          >
            <span className="timeline-list__t">{formatT(m.t)}</span>
            <span className="timeline-list__name">{m.name}</span>
            <span className="timeline-list__note">{m.note}</span>
          </li>
        );
      })}
    </ol>
  );
}
