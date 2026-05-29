export default function Logo({ onSettings }) {
  return (
    <div className="mh-logo">
      <div className="mh-logo__text">
        <span className="mh-logo__name">MERRY HAVEN</span>
        <span className="mh-logo__sub">LAUNCH OPS</span>
      </div>
      {onSettings && (
        <button className="mh-logo__settings" onClick={onSettings} title="Settings">⋯</button>
      )}
    </div>
  );
}
