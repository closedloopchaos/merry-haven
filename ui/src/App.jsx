import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLaunches } from './hooks/useLaunches.js';
import { useWeather } from './hooks/useWeather.js';
import { useLaunchWatch } from './hooks/useLaunchWatch.js';
import LaunchColumn from './components/LaunchColumn.jsx';
import LaunchDetail from './components/LaunchDetail.jsx';
import CenterPanel from './components/CenterPanel.jsx';
import WeatherPanel from './components/WeatherPanel.jsx';
import LaunchExpanded from './components/LaunchExpanded.jsx';
import StreamEmbed from './components/StreamEmbed.jsx';
import NewsTicker from './components/NewsTicker.jsx';
import CountdownView from './components/CountdownView.jsx';
import SettingsMenu from './components/SettingsMenu.jsx';
import { useStatusChanges } from './hooks/useStatusChanges.js';

const TEST_COUNTDOWN_DURATION_MS = 90_000;
const TEST_COUNTDOWN_OFFSET_MS   = 60_000;

export default function App() {
  const { launches, loading: launchLoading, lastFetched: launchFetched } = useLaunches();
  const { weather } = useWeather();
  const { launchMode, countdownMode, activeLaunch, dismiss, dismissCountdown } = useLaunchWatch(launches);
  const statusChangedIds = useStatusChanges(launches);
  const [selectedId, setSelectedId] = useState(null);
  const displayLaunch = selectedId
    ? (launches.find(l => l.id === selectedId) ?? launches[0] ?? null)
    : (launches[0] ?? null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [testCountdown, setTestCountdown] = useState(false);
  const testNetTimeRef = useRef(null);

  function startTestCountdown() {
    testNetTimeRef.current = new Date(Date.now() + TEST_COUNTDOWN_OFFSET_MS).toISOString();
    setTestCountdown(true);
    setSettingsOpen(false);
    setTimeout(() => setTestCountdown(false), TEST_COUNTDOWN_DURATION_MS);
  }

  const showCountdown = countdownMode || testCountdown;
  const countdownLaunch = testCountdown
    ? { ...(launches[0] ?? {}), net: testNetTimeRef.current, name: launches[0]?.name ?? 'TEST MISSION' }
    : activeLaunch;
  const onCloseCountdown = testCountdown ? () => setTestCountdown(false) : dismissCountdown;

  return (
    <div className="app">
      <div className="app__main-area">
        <AnimatePresence mode="wait">
          {showCountdown && countdownLaunch ? (
            <motion.div
              key="countdown-view"
              className="countdown-view-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <CountdownView
                launch={countdownLaunch}
                isTest={testCountdown}
                onDismiss={onCloseCountdown}
              />
            </motion.div>
          ) : launchMode ? (
            <motion.div
              key="launch-mode"
              className="app__launch-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="app__launch-expanded-panel"
                initial={{ width: '380px' }}
                animate={{ width: 'calc(100% * 2 / 3)' }}
                transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
              >
                <LaunchExpanded launch={activeLaunch} onDismiss={dismiss} />
              </motion.div>
              <motion.div
                className="app__stream-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'calc(100% / 3)', opacity: 1 }}
                transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: 0.25 }}
              >
                <StreamEmbed launch={activeLaunch} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="normal-mode"
              className="app__normal-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LaunchColumn
                launches={launches}
                loading={launchLoading}
                lastFetched={launchFetched}
                selectedId={selectedId}
                onSelectLaunch={setSelectedId}
                onOpenSettings={() => setSettingsOpen(true)}
                changedIds={statusChangedIds}
              />

              {displayLaunch && (
                <div className="launch-detail-col">
                  <LaunchDetail launch={displayLaunch} />
                </div>
              )}

              <CenterPanel launches={launches} />

              <div className="weather-col">
                <WeatherPanel
                  weather={weather}
                  launches={launches}
                  selectedLaunch={displayLaunch}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {!showCountdown && (
          <motion.div
            key="news-ticker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <NewsTicker />
          </motion.div>
        )}
      </AnimatePresence>
      <SettingsMenu
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onTestCountdown={startTestCountdown}
      />
    </div>
  );
}
