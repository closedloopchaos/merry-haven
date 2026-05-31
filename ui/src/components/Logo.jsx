export default function Logo({ onSettings }) {
  return (
    <div className="mh-logo">
      <div className="mh-logo__text">
        <span className="mh-logo__name">MERRY</span>
        <span className="mh-logo__slab" aria-hidden="true" />
        <span className="mh-logo__name">HAVEN</span>
      </div>
      {onSettings && (
        <button className="mh-logo__settings" onClick={onSettings} title="Settings">⋯</button>
      )}
    </div>
  );
}
