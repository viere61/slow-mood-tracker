import React from 'react';
import { Music, Eye, Clock, Calendar } from 'lucide-react';
import { timeUtils } from '../utils/timeUtils';

interface HomeViewProps {
  canLogToday: boolean;
  isLoggingWindow: boolean;
  lastLogDate: string | null;
  onStartLogging: () => void;
  onReview: () => void;
  settings: {
    dailyWindowStart: number;
    dailyWindowEnd: number;
  };
}

const HomeView: React.FC<HomeViewProps> = ({
  canLogToday,
  isLoggingWindow,
  lastLogDate,
  onStartLogging,
  onReview,
  settings
}) => {
  const getStatusMessage = () => {
    if (!canLogToday) {
      return {
        title: "Already logged today",
        message: "You've already captured your mood for today. Come back tomorrow for a new reflection.",
        icon: Calendar,
        color: "text-gray-600"
      };
    }
    
    if (isLoggingWindow) {
      const todayWindow = timeUtils.getTodayLoggingWindowDisplay(settings.dailyWindowStart, settings.dailyWindowEnd);
      return {
        title: "Time to reflect",
        message: `The invitation to log your mood is now open (${todayWindow}). Take a moment to pause and consider how you're feeling.`,
        icon: Clock,
        color: "text-green-600"
      };
    }
    
    const todayWindow = timeUtils.getTodayLoggingWindowDisplay(settings.dailyWindowStart, settings.dailyWindowEnd);
    return {
      title: "Waiting for the moment",
      message: `Your daily mood logging window (${todayWindow}) hasn't opened yet. The app will invite you when it's time.`,
      icon: Clock,
      color: "text-gray-600"
    };
  };

  const status = getStatusMessage();
  const StatusIcon = status.icon;

  // DEBUG: Log the time gating logic
  const todayWindow = timeUtils.getTodayLoggingWindow(settings.dailyWindowStart, settings.dailyWindowEnd);
  const now = new Date();
  const currentHour = now.getHours();
  // eslint-disable-next-line no-console
  console.log('[DEBUG] Today window:', todayWindow, 'Current hour:', currentHour);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* DEBUG MARKER */}
      <div className="text-center text-xs text-red-500 font-bold">DEBUG: v1</div>
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-light text-slow-dark">Welcome - TESTING HOT RELOAD</h2>
        <p className="text-gray-600 text-sm">
          A mindful approach to tracking your emotional journey through music
        </p>
      </div>

      {/* Status Card */}
      <div className="slow-card">
        <div className="flex items-start space-x-3">
          <StatusIcon className={`w-6 h-6 mt-1 ${status.color}`} />
          <div className="flex-1">
            <h3 className="font-medium text-slow-dark">{status.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{status.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              Current time: {timeUtils.getCurrentTime()}
            </p>
          </div>
        </div>
      </div>

      {/* Last Log Info */}
      {lastLogDate && (
        <div className="slow-card bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-2 text-blue-700">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              Last logged: {timeUtils.formatDate(lastLogDate)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {isLoggingWindow && (
          <button
            onClick={onStartLogging}
            className="w-full slow-button-primary flex items-center justify-center space-x-2"
          >
            <Music className="w-5 h-5" />
            <span>Log My Mood</span>
          </button>
        )}

        <button
          onClick={onReview}
          className="w-full slow-button-secondary flex items-center justify-center space-x-2"
        >
          <Eye className="w-5 h-5" />
          <span>Reveal Random Past Mood</span>
        </button>
      </div>

      {/* Philosophy Note */}
      <div className="text-center text-xs text-gray-500 space-y-2">
        <p>
          "The slow technology approach invites us to pause, reflect, and find meaning in the spaces between our digital interactions."
        </p>
        <p>
          This app operates on its own time, encouraging deeper self-reflection through music and mindful engagement.
        </p>
      </div>
    </div>
  );
};

export default HomeView; 