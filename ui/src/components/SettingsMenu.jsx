export default function SettingsMenu({ open, onClose, onTestCountdown }) {
  if (!open) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-modal__header">
          <span className="settings-modal__title">SETTINGS</span>
          <button className="settings-modal__close" onClick={onClose}>CLOSE ✕</button>
        </div>
        <div className="settings-modal__body">
          <button className="settings-modal__action" onClick={onTestCountdown}>
            TEST COUNTDOWN VIEW
          </button>
          <p className="settings-modal__note">
            Fires the cinematic takeover with a synthetic 60-second countdown so
            you can preview the effect without waiting for an actual launch.
          </p>
        </div>
      </div>
    </div>
  );
}
