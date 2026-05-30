export default function SettingsMenu({
  open,
  onClose,
  onTestCountdown,
  activeSite,
  launchesFetched,
  weatherFetched,
  newsFetched,
}) {
  if (!open) return null;

  const dataRows = [
    { label: 'LAUNCHES (LL2)',         time: launchesFetched, ttl: '5 MIN'  },
    { label: `WEATHER (${activeSite?.nwsStation ?? '—'})`, time: weatherFetched,  ttl: '15 MIN' },
    { label: 'NEWS (SPACEFLIGHT)',     time: newsFetched,     ttl: '10 MIN' },
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-modal__header">
          <span className="settings-modal__title">SETTINGS</span>
          <button className="settings-modal__close" onClick={onClose}>CLOSE ✕</button>
        </div>

        <div className="settings-modal__body">
          <div className="settings-modal__section">
            <div className="settings-modal__section-label">DATA SOURCES</div>
            <table className="settings-modal__table">
              <tbody>
                {dataRows.map(r => (
                  <tr key={r.label}>
                    <td className="settings-modal__table-label">{r.label}</td>
                    <td className="settings-modal__table-value">{r.time ?? '—'}</td>
                    <td className="settings-modal__table-ttl">EVERY {r.ttl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="settings-modal__section">
            <div className="settings-modal__section-label">ACTIVE RANGE</div>
            <div className="settings-modal__active-site">
              {activeSite?.label ?? 'SPACE COAST'}
              <span className="settings-modal__active-site-meta">
                {activeSite?.nwsStation ?? ''} ·
                {' '}{activeSite?.coords?.[1]?.toFixed(2) ?? '—'}°N
                {' · '}{Math.abs(activeSite?.coords?.[0] ?? 0).toFixed(2)}°W
              </span>
            </div>
          </div>

          <div className="settings-modal__section">
            <div className="settings-modal__section-label">DIAGNOSTICS</div>
            <button className="settings-modal__action" onClick={onTestCountdown}>
              TEST COUNTDOWN VIEW
            </button>
            <p className="settings-modal__note">
              Fires the cinematic takeover with a synthetic 60-second countdown so
              you can preview the effect without waiting for an actual launch.
            </p>
          </div>

          <div className="settings-modal__section">
            <div className="settings-modal__section-label">BUILD</div>
            <div className="settings-modal__build">
              MERRY HAVEN · LAUNCH OPS · CORSAIR XENEON EDGE 2560×720
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
