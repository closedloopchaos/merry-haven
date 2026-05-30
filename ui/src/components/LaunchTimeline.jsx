import { useState } from 'react';
import { getTimeline, detectFamily } from '../data/trajectories.js';
import TimelineTape from './TimelineTape.jsx';
import TimelineList from './TimelineList.jsx';

const VIEWS = [
  { id: 'tape', label: 'TAPE' },
  { id: 'list', label: 'LIST' },
];

function formatT(seconds) {
  const sign = seconds < 0 ? '-' : '+';
  const abs = Math.abs(seconds);
  const m = Math.floor(abs / 60);
  const s = Math.floor(abs % 60);
  return `T${sign}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function LaunchTimeline({ launch }) {
  const [view, setView] = useState(() => {
    try { return localStorage.getItem('mh-timeline-view') || 'tape'; } catch { return 'tape'; }
  });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  function selectView(v) {
    setView(v);
    try { localStorage.setItem('mh-timeline-view', v); } catch {}
  }

  function handleClick(i) {
    setSelectedIdx(prev => prev === i ? null : i);
  }

  if (!launch) {
    return (
      <div className="timeline timeline--empty">
        <div className="timeline__empty-note">SELECT A LAUNCH TO VIEW ITS TIMELINE</div>
      </div>
    );
  }

  const tl = getTimeline(launch);
  const family = detectFamily(launch);
  const nominal = !family;
  const activeIdx = selectedIdx ?? hoverIdx;
  const activeMilestone = activeIdx != null ? tl.milestones[activeIdx] : null;

  return (
    <div className="timeline">
      <div className="timeline__header-row">
        <div className="timeline__title-block">
          <span className="timeline__title">LAUNCH TIMELINE</span>
          <span className="timeline__mission">{launch.name}</span>
        </div>
        <span className="timeline__family">
          {tl.family}{nominal && ' · NOMINAL'}
        </span>
      </div>

      <div className="timeline__view-tabs">
        {VIEWS.map(v => (
          <button
            key={v.id}
            className={`timeline__view-tab ${view === v.id ? 'is-active' : ''}`}
            onClick={() => selectView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="timeline__viewport">
        {view === 'tape' && (
          <TimelineTape
            timeline={tl}
            activeIdx={activeIdx}
            selectedIdx={selectedIdx}
            onHover={setHoverIdx}
            onClick={handleClick}
          />
        )}
        {view === 'list' && (
          <TimelineList
            timeline={tl}
            activeIdx={activeIdx}
            selectedIdx={selectedIdx}
            onHover={setHoverIdx}
            onClick={handleClick}
          />
        )}
      </div>

      <div className="timeline__detail">
        {activeMilestone ? (
          <>
            <span className="timeline__detail-time">{formatT(activeMilestone.t)}</span>
            <span className="timeline__detail-name">{activeMilestone.name}</span>
            <span className="timeline__detail-note">{activeMilestone.note}</span>
          </>
        ) : (
          <span className="timeline__detail-hint">
            HOVER A MILESTONE FOR DETAIL · CLICK TO PIN
          </span>
        )}
      </div>
    </div>
  );
}
