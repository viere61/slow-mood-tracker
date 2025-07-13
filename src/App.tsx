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