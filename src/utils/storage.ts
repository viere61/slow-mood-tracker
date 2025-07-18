import { MoodEntry, UserSettings } from '../types';

const MOOD_ENTRIES_KEY = 'slow-mood-entries';
const SETTINGS_KEY = 'slow-mood-settings';
const LAST_LOG_DATE_KEY = 'slow-mood-last-log';

export const storage = {
  // Mood entries
  getMoodEntries: (): MoodEntry[] => {
    try {
      const stored = localStorage.getItem(MOOD_ENTRIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveMoodEntry: (entry: MoodEntry): void => {
    try {
      const entries = storage.getMoodEntries();
      entries.push(entry);
      localStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save mood entry:', error);
    }
  },

  // Settings
  getSettings: (): UserSettings => {
    const stored = localStorage.getItem('mood-tracker-settings');
    if (stored) {
      const settings = JSON.parse(stored);
      // Handle migration from old format
      if (settings.email && typeof settings.email === 'string') {
        settings.emailNotifications = {
          enabled: false,
          email: settings.email
        };
        delete settings.email;
      }
      return settings;
    }
    return {
      dailyWindowStart: 9,
      dailyWindowEnd: 21,
      emailNotifications: {
        enabled: false,
        email: ''
      }
    };
  },

  saveSettings: (settings: UserSettings): void => {
    try {
      localStorage.setItem('mood-tracker-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Last log date
  getLastLogDate: (): string | null => {
    return localStorage.getItem(LAST_LOG_DATE_KEY);
  },

  setLastLogDate: (date: string): void => {
    localStorage.setItem(LAST_LOG_DATE_KEY, date);
  },

  // Utility functions
  clearAllData: (): void => {
    localStorage.removeItem(MOOD_ENTRIES_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(LAST_LOG_DATE_KEY);
  },

  clearMoodEntries: (): void => {
    localStorage.removeItem(MOOD_ENTRIES_KEY);
  },

  clearLastLogDate: (): void => {
    localStorage.removeItem(LAST_LOG_DATE_KEY);
  },

  resetTodayLogStatus: (): void => {
    localStorage.removeItem(LAST_LOG_DATE_KEY);
  },
}; 