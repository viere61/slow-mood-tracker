import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const timeUtils = {
  // Check if current time is within the user's daily logging window
  isInLoggingWindow: (startHour: number, endHour: number): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= startHour && currentHour < endHour;
  },

  // Generate a random hour within the user's window for today
  getRandomLoggingHour: (startHour: number, endHour: number): number => {
    return Math.floor(Math.random() * (endHour - startHour)) + startHour;
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
    const today = new Date();
    return !isToday(lastLog);
  },
}; 