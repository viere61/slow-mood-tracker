<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { MoodEntry, UserSettings } from './types';
import { storage } from './utils/storage';
import { timeUtils } from './utils/timeUtils';
import HomeView from './components/HomeView';
import LoggingView from './components/LoggingView';
import ReviewView from './components/ReviewView';
import SettingsView from './components/SettingsView';
import Header from './components/Header';

type View = 'home' | 'logging' | 'review' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings());
  const [lastLogDate, setLastLogDate] = useState<string | null>(storage.getLastLogDate());
  const [isLoggingWindow, setIsLoggingWindow] = useState(false);

  // Check if we're in the logging window and if user can log today
  useEffect(() => {
    const checkLoggingStatus = () => {
      const inWindow = timeUtils.isInLoggingWindow(settings.dailyWindowStart, settings.dailyWindowEnd);
      const canLog = timeUtils.canLogToday(lastLogDate);
      setIsLoggingWindow(inWindow && canLog);
    };

    checkLoggingStatus();
    // Check every minute
    const interval = setInterval(checkLoggingStatus, 60000);
    return () => clearInterval(interval);
  }, [settings, lastLogDate]);

  const handleMoodLogged = (moodEntry: MoodEntry) => {
    storage.saveMoodEntry(moodEntry);
    setLastLogDate(timeUtils.getCurrentDate());
    setIsLoggingWindow(false);
    setCurrentView('home');
  };

  const handleSettingsUpdate = (newSettings: UserSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const canLogToday = timeUtils.canLogToday(lastLogDate);

  return (
    <div className="min-h-screen bg-slow-gray">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        canLogToday={canLogToday}
        isLoggingWindow={isLoggingWindow}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        {currentView === 'home' && (
          <HomeView
            canLogToday={canLogToday}
            isLoggingWindow={isLoggingWindow}
            lastLogDate={lastLogDate}
            onStartLogging={() => setCurrentView('logging')}
            onReview={() => setCurrentView('review')}
            onSettings={() => setCurrentView('settings')}
          />
        )}
        
        {currentView === 'logging' && (
          <LoggingView
            onMoodLogged={handleMoodLogged}
            onCancel={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'review' && (
          <ReviewView
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'settings' && (
          <SettingsView
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>
    </div>
  );
}

export default App; 
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> d873b2b (2nd version, now: 1) added time gating function 2) able to delete all data or reset today's log status)
