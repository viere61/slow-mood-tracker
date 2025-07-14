import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const timeUtils = {
  // Generate a random 1-hour window within the user's daily range for today
  getTodayLoggingWindow: (startHour: number, endHour: number): { start: number; end: number } => {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').join(''); // Use date as seed for consistent daily window
    const randomHour = timeUtils.getRandomHourFromSeed(seed, startHour, endHour);
    return {
      start: randomHour,
      end: randomHour + 1
    };
  },

  // Generate consistent random hour based on date seed
  getRandomHourFromSeed: (seed: string, startHour: number, endHour: number): number => {
    const num = parseInt(seed, 10);
    const range = endHour - startHour;
    const randomIndex = num % range;
    return startHour + randomIndex;
  },

  // Check if current time is within today's randomly selected 1-hour logging window
  isInLoggingWindow: (startHour: number, endHour: number): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayWindow = timeUtils.getTodayLoggingWindow(startHour, endHour);
    return currentHour >= todayWindow.start && currentHour < todayWindow.end;
  },

  // Get today's logging window for display purposes
  getTodayLoggingWindowDisplay: (startHour: number, endHour: number): string => {
    const window = timeUtils.getTodayLoggingWindow(startHour, endHour);
    const startTime = timeUtils.formatHour(window.start);
    const endTime = timeUtils.formatHour(window.end);
    return `${startTime} - ${endTime}`;
  },

  // Format hour for display
  formatHour: (hour: number): string => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  },

  // Check if user can log today (hasn't logged yet)
  canLogToday: (lastLogDate: string | null): boolean => {
    if (!lastLogDate) return true;
    return !isToday(parseISO(lastLogDate));
  },

  // Format date for display
  formatDate: (date: string): string => {
    const parsedDate = parseISO(date);
    if (isToday(parsedDate)) {
      return 'Today';
    } else if (isYesterday(parsedDate)) {
      return 'Yesterday';
    } else {
      return format(parsedDate, 'MMM d, yyyy');
    }
  },

  // Get current date in ISO format
  getCurrentDate: (): string => {
    return new Date().toISOString().split('T')[0];
  },

  // Get current time in readable format
  getCurrentTime: (): string => {
    return format(new Date(), 'h:mm a');
  },

  // Check if it's a new day since last log
  isNewDay: (lastLogDate: string | null): boolean => {
    if (!lastLogDate) return true;
    const lastLog = parseISO(lastLogDate);
    return !isToday(lastLog);
  },
}; 