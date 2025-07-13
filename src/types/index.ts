export interface MoodEntry {
  id: string;
  date: string;
  moodValue: number; // 1-10 scale
  descriptors: string[];
  contexts: string[];
  song: SongInfo;
  thoughts?: string;
}

export interface SongInfo {
  title: string;
  artist: string;
  spotifyId?: string;
  albumArt?: string;
}

export interface UserSettings {
  dailyWindowStart: number; // Hour in 24-hour format (e.g., 9 for 9 AM)
  dailyWindowEnd: number; // Hour in 24-hour format (e.g., 22 for 10 PM)
  emailNotifications: boolean;
  email?: string;
}

export interface AppState {
  currentMood: MoodEntry | null;
  canLogToday: boolean;
  lastLogDate: string | null;
  settings: UserSettings;
  isLoggingWindow: boolean;
}

export const MOOD_DESCRIPTORS = [
  'content', 'depressed', 'grateful', 'calm', 'anxious', 'excited',
  'melancholic', 'peaceful', 'stressed', 'joyful', 'contemplative',
  'energetic', 'tired', 'focused', 'scattered', 'inspired', 'stuck'
] as const;

export const CONTEXT_CATEGORIES = [
  'Family', 'Work', 'Weather', 'Health', 'Social', 'Creative',
  'Learning', 'Exercise', 'Music', 'Nature', 'Technology', 'Food'
] as const;

export type MoodDescriptor = typeof MOOD_DESCRIPTORS[number];
export type ContextCategory = typeof CONTEXT_CATEGORIES[number]; 