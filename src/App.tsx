<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
>>>>>>> f5cb3c7 (this is the actual 2nd version, the earlier one actually does not funtion as expected)

// Simple time utilities
const getCurrentHour = () => new Date().getHours();
const getCurrentTime = () => new Date().toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit',
  hour12: true 
});

// Generate today's 1-hour window based on date
const getTodayWindow = (startHour: number, endHour: number) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = parseInt(today.replace(/-/g, ''), 10);
  const range = endHour - startHour;
  const randomHour = startHour + (seed % range);
  return { start: randomHour, end: randomHour + 1 };
};



// Format hour for display
const formatHour = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    hour12: true 
  });
};

// Storage utilities
const getMoodEntries = () => {
  try {
    const stored = localStorage.getItem('mood-entries');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMoodEntry = (entry: any) => {
  try {
    const entries = getMoodEntries();
    entries.push(entry);
    localStorage.setItem('mood-entries', JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save mood entry:', error);
  }
};

const getLastLogDate = () => {
  return localStorage.getItem('last-log-date');
};

const setLastLogDate = (date: string) => {
  localStorage.setItem('last-log-date', date);
};

const clearLastLogDate = () => {
  localStorage.removeItem('last-log-date');
};

// Check if user can log today
const canLogToday = () => {
  const lastLogDate = getLastLogDate();
  if (!lastLogDate) return true;
  const today = new Date().toISOString().split('T')[0];
  return lastLogDate !== today;
};

// Clear all mood entries
const clearMoodEntries = () => {
  try {
    localStorage.removeItem('mood-entries');
  } catch (error) {
    console.error('Failed to clear mood entries:', error);
  }
};

// Clear all data (entries + last log date)
const clearAllData = () => {
  clearMoodEntries();
  clearLastLogDate();
};

function App() {
  // Load settings from localStorage
  const getSettings = () => {
    try {
      const stored = localStorage.getItem('slow-mood-settings');
      return stored ? JSON.parse(stored) : {
        dailyWindowStart: 9,
        dailyWindowEnd: 21, // 9 PM
        emailNotifications: false,
      };
    } catch {
      return {
        dailyWindowStart: 9,
        dailyWindowEnd: 21, // 9 PM
        emailNotifications: false,
      };
    }
  };

  const [settings, setSettings] = useState(getSettings);
  const [dailyStart, setDailyStart] = useState(settings.dailyWindowStart);
  const [dailyEnd, setDailyEnd] = useState(settings.dailyWindowEnd);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [view, setView] = useState<'main' | 'logging' | 'review'>('main');
  
  // Mood logging state
  const [moodValue, setMoodValue] = useState(5);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);

  // Save settings to localStorage
  const saveSettings = (newSettings: any) => {
    try {
      localStorage.setItem('slow-mood-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      setDailyStart(newSettings.dailyWindowStart);
      setDailyEnd(newSettings.dailyWindowEnd);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
    setDailyStart(savedSettings.dailyWindowStart);
    setDailyEnd(savedSettings.dailyWindowEnd);
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Memoize today's window so it doesn't change during the day
  const [todayWindow, setTodayWindow] = useState(() => getTodayWindow(dailyStart, dailyEnd));
  const currentHour = getCurrentHour();
  const canLog = canLogToday();
  
  // Update today's window only when the date changes or settings change
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentWindow = getTodayWindow(dailyStart, dailyEnd);
    setTodayWindow(currentWindow);
  }, [dailyStart, dailyEnd]);

  // Check if it's a new day and update window accordingly
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastCheckedDate = localStorage.getItem('last-checked-date');
      
      if (lastCheckedDate !== today) {
        // It's a new day, update the window
        const newWindow = getTodayWindow(dailyStart, dailyEnd);
        setTodayWindow(newWindow);
        localStorage.setItem('last-checked-date', today);
      }
    };

    // Check immediately
    checkNewDay();
    
    // Check every minute for date changes
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, [dailyStart, dailyEnd]);

  const inWindow = currentHour >= todayWindow.start && currentHour < todayWindow.end;

  const getMoodLabel = (value: number) => {
    if (value <= 2) return 'Very Unpleasant';
    if (value <= 4) return 'Unpleasant';
    if (value <= 6) return 'Neutral';
    if (value <= 8) return 'Pleasant';
    return 'Very Pleasant';
  };

  const handleLogMood = () => {
    if (!songTitle.trim() || !songArtist.trim()) {
      alert('Please enter both song title and artist');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      moodValue,
      song: {
        title: songTitle.trim(),
        artist: songArtist.trim()
      },
      thoughts: thoughts.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    saveMoodEntry(entry);
    setLastLogDate(entry.date);
    
    // Reset form
    setMoodValue(5);
    setSongTitle('');
    setSongArtist('');
    setThoughts('');
    setView('main');
  };

  const revealRandomMood = () => {
    const entries = getMoodEntries();
    if (entries.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Compare dates by YYYY-MM-DD format to avoid timezone issues
    const dateOnly = date.toISOString().split('T')[0];
    const todayOnly = today.toISOString().split('T')[0];
    const yesterdayOnly = yesterday.toISOString().split('T')[0];
    
    if (dateOnly === todayOnly) {
      return 'Today';
    } else if (dateOnly === yesterdayOnly) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  if (view === 'logging') {
    return (
      <div style={{ 
        fontFamily: 'system-ui, sans-serif', 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ color: '#2d3748', margin: 0 }}>Log Your Mood</h1>
          <button 
            onClick={() => setView('main')}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#e2e8f0',
              color: '#4a5568',
              cursor: 'pointer'
            }}
          >
            ✕ Cancel
          </button>
        </div>

        {/* Mood Slider */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <label style={{ display: 'block', marginBottom: '15px', color: '#2d3748', fontWeight: 'bold' }}>
            How are you feeling right now?
          </label>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="range"
              min="1"
              max="10"
              value={moodValue}
              onChange={(e) => setMoodValue(Number(e.target.value))}
              style={{ width: '100%', height: '8px', borderRadius: '4px' }}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '14px', 
            color: '#666' 
          }}>
            <span>Very Unpleasant</span>
            <span style={{ fontWeight: 'bold', color: '#2d3748' }}>
              {getMoodLabel(moodValue)}
            </span>
            <span>Very Pleasant</span>
          </div>
        </div>

        {/* Song Selection */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <label style={{ display: 'block', marginBottom: '15px', color: '#2d3748', fontWeight: 'bold' }}>
            🎵 What song reflects your mood?
          </label>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input
              type="text"
              placeholder="Song title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
            <input
              type="text"
              placeholder="Artist"
              value={songArtist}
              onChange={(e) => setSongArtist(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {/* Additional Thoughts */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <label style={{ display: 'block', marginBottom: '15px', color: '#2d3748', fontWeight: 'bold' }}>
            Any additional thoughts? (optional)
          </label>
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="Reflect on your mood, the song choice, or anything else..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleLogMood}
          disabled={!songTitle.trim() || !songArtist.trim()}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: songTitle.trim() && songArtist.trim() ? '#4299e1' : '#cbd5e0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: songTitle.trim() && songArtist.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          💾 Save Mood Entry
        </button>
      </div>
    );
  }

  if (view === 'review') {
    const randomEntry = revealRandomMood();
    
    return (
      <div style={{ 
        fontFamily: 'system-ui, sans-serif', 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ color: '#2d3748', margin: 0 }}>Past Mood Reveal</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setView('main')}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#e2e8f0',
                color: '#4a5568',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#4299e1',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              🔄 New
            </button>
          </div>
        </div>

        {randomEntry ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Date */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '15px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <span style={{ color: '#4299e1', fontWeight: 'bold' }}>
                📅 {formatDate(randomEntry.date)}
              </span>
            </div>

            {/* Mood Value */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2d3748', marginBottom: '10px' }}>
                {randomEntry.moodValue}/10
              </div>
              <div style={{ color: '#666', fontSize: '16px' }}>
                {getMoodLabel(randomEntry.moodValue)}
              </div>
            </div>

            {/* Song - The Focus */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '2px solid #4299e1'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎵</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748', marginBottom: '5px' }}>
                {randomEntry.song.title}
              </div>
              <div style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
                {randomEntry.song.artist}
              </div>
              <div style={{ fontSize: '14px', color: '#888', fontStyle: 'italic' }}>
                "This song captured your mood on {formatDate(randomEntry.date)}"
              </div>
            </div>

            {/* Thoughts */}
            {randomEntry.thoughts && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>Your Thoughts</h3>
                <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>
                  "{randomEntry.thoughts}"
                </p>
              </div>
            )}

            {/* Reflection Prompt */}
            <div style={{ 
              backgroundColor: '#fef5e7', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '2px solid #f6ad55',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>💭</div>
              <p style={{ color: '#744210', margin: '0 0 10px 0', fontWeight: 'bold' }}>
                Take a moment to reflect on this past mood.
              </p>
              <p style={{ color: '#744210', margin: 0, fontSize: '14px' }}>
                How does it relate to where you are now? Consider listening to "{randomEntry.song.title}" again.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎵</div>
            <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>No mood entries yet</h3>
            <p style={{ color: '#666', margin: 0 }}>
              Start logging your moods to see them here. Each entry will be revealed randomly for reflection.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '30px' }}>
        🎵 Slow Sonic Mood Tracker
      </h1>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Current Status</h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Current Time:</span>
            <span style={{ fontWeight: 'bold' }}>{currentTime}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Current Hour:</span>
            <span style={{ fontWeight: 'bold' }}>{currentHour}:00</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Daily Window:</span>
            <span style={{ fontWeight: 'bold' }}>{dailyStart}:00 - {dailyEnd}:00</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Today's 1-Hour Window:</span>
            <span style={{ fontWeight: 'bold', color: '#4299e1' }}>
              {formatHour(todayWindow.start)} - {formatHour(todayWindow.end)}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Can Log Today:</span>
            <span style={{ 
              fontWeight: 'bold', 
              color: canLog ? '#48bb78' : '#f56565' 
            }}>
              {canLog ? '✅ YES' : '❌ NO'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>In Logging Window:</span>
            <span style={{ 
              fontWeight: 'bold', 
              color: inWindow ? '#48bb78' : '#f56565' 
            }}>
              {inWindow ? '✅ YES' : '❌ NO'}
            </span>
          </div>
        </div>
      </div>

      {/* Logging Button */}
      {inWindow && canLog && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => setView('logging')}
            style={{
              padding: '15px 30px',
              backgroundColor: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🎵 Log My Mood Now
          </button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Your 1-hour window is open! ({formatHour(todayWindow.start)} - {formatHour(todayWindow.end)})
          </p>
        </div>
      )}

      {/* Review Button */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => setView('review')}
          style={{
            padding: '15px 30px',
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          👁️ Reveal Random Past Mood
        </button>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Discover a past mood entry for reflection
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Settings</h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Daily Window Start:
            </label>
            <select 
              value={dailyStart} 
              onChange={(e) => {
                const newStart = Number(e.target.value);
                setDailyStart(newStart);
                saveSettings({
                  ...settings,
                  dailyWindowStart: newStart
                });
              }}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '6px', 
                border: '1px solid #ddd' 
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
              Daily Window End:
            </label>
            <select 
              value={dailyEnd} 
              onChange={(e) => {
                const newEnd = Number(e.target.value);
                setDailyEnd(newEnd);
                saveSettings({
                  ...settings,
                  dailyWindowEnd: newEnd
                });
              }}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '6px', 
                border: '1px solid #ddd' 
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Data Management</h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fef5e7', 
            borderRadius: '8px',
            border: '1px solid #f6ad55'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#744210', fontSize: '14px' }}>
              <strong>Current Status:</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#744210', fontSize: '14px' }}>Mood Entries:</span>
              <span style={{ color: '#744210', fontSize: '14px', fontWeight: 'bold' }}>
                {getMoodEntries().length} entries
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#744210', fontSize: '14px' }}>Last Log Date:</span>
              <span style={{ color: '#744210', fontSize: '14px', fontWeight: 'bold' }}>
                {getLastLogDate() ? formatDate(getLastLogDate()!) : 'Never'}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <button
              onClick={() => setShowClearDataDialog(true)}
              style={{
                padding: '12px 20px',
                backgroundColor: '#f56565',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear All Data
            </button>
            
            <button
              onClick={() => {
                clearLastLogDate();
                window.location.reload();
              }}
              style={{
                padding: '12px 20px',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Reset Today's Log Status
            </button>
          </div>
          
          <p style={{ margin: '0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
            <strong>Clear All Data:</strong> Deletes all mood entries and resets your daily log status.<br/>
            <strong>Reset Today's Log Status:</strong> Allows you to log again today if you've already logged.
          </p>
        </div>
      </div>

      <div style={{ 
        backgroundColor: inWindow && canLog ? '#d4edda' : '#f8d7da', 
        padding: '20px', 
        borderRadius: '12px', 
        border: `2px solid ${inWindow && canLog ? '#c3e6cb' : '#f5c6cb'}`,
        textAlign: 'center'
      }}>
        <h3 style={{ 
          color: inWindow && canLog ? '#155724' : '#721c24', 
          marginBottom: '10px' 
        }}>
          {inWindow && canLog ? '🎉 LOGGING IS OPEN!' : '⏰ LOGGING IS CLOSED'}
        </h3>
        <p style={{ 
          color: inWindow && canLog ? '#155724' : '#721c24', 
          margin: 0 
        }}>
          {inWindow && canLog 
            ? `You can log your mood now (${formatHour(todayWindow.start)} - ${formatHour(todayWindow.end)})`
            : !canLog 
              ? 'You have already logged today. Come back tomorrow!'
              : `Wait for your 1-hour window to open (${formatHour(todayWindow.start)} - ${formatHour(todayWindow.end)})`
          }
        </p>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e2e8f0', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#4a5568'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>How it works:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Set your daily window (e.g., 9 AM - 11 AM)</li>
          <li>Each day, a random 1-hour window is selected within your daily range</li>
          <li>You can only log during that specific 1-hour window</li>
          <li>You can only log once per day</li>
          <li>Each mood entry includes a song that reflects your emotional state</li>
        </ul>
      </div>

      {/* Clear Data Confirmation Dialog */}
      {showClearDataDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ 
              color: '#2d3748', 
              marginBottom: '16px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              🗑️ Clear All Data?
            </h3>
            
            <p style={{ 
              color: '#666', 
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              This will permanently delete all your mood entries and reset your daily log status. 
              This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowClearDataDialog(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearDataDialog(false);
                  window.location.reload();
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f56565',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
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
