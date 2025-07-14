import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Trash2, Mail, Bell, BellOff } from 'lucide-react';
import { UserSettings } from '../types';
import { storage } from '../utils/storage';
import { timeUtils } from '../utils/timeUtils';
import { emailService } from '../utils/emailService';

interface SettingsViewProps {
  settings: UserSettings;
  onSettingsUpdate: (settings: UserSettings) => void;
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  settings, 
  onSettingsUpdate, 
  onBack 
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [showClearData, setShowClearData] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Initialize email notifications if not present
  useEffect(() => {
    if (!localSettings.emailNotifications) {
      setLocalSettings(prev => ({
        ...prev,
        emailNotifications: {
          enabled: false,
          email: ''
        }
      }));
    }
  }, [localSettings.emailNotifications]);

  // Check server health on mount
  useEffect(() => {
    const checkServer = async () => {
      const isHealthy = await emailService.checkServerHealth();
      setServerStatus(isHealthy ? 'online' : 'offline');
    };
    checkServer();
  }, []);

  const handleSave = async () => {
    // Handle email notification registration/unregistration
    if (localSettings.emailNotifications) {
      const { enabled, email } = localSettings.emailNotifications;
      
      if (enabled && email) {
        setEmailStatus('loading');
        const success = await emailService.registerEmail(
          email, 
          localSettings.dailyWindowStart, 
          localSettings.dailyWindowEnd
        );
        setEmailStatus(success ? 'success' : 'error');
      } else if (!enabled && email) {
        setEmailStatus('loading');
        await emailService.unregisterEmail(email);
        setEmailStatus('success');
      }
    }

    onSettingsUpdate(localSettings);
  };

  const handleClearData = () => {
    storage.clearAllData();
    setShowClearData(false);
    // Reset to default settings
    const defaultSettings: UserSettings = {
      dailyWindowStart: 9,
      dailyWindowEnd: 21, // 9 PM
    };
    onSettingsUpdate(defaultSettings);
  };

  const formatHour = (hour: number) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-500 hover:text-slow-dark transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-xl font-medium text-slow-dark">Settings</h2>
        <button
          onClick={handleSave}
          className="text-slow-blue hover:text-blue-600 font-medium"
        >
          Save
        </button>
      </div>

      {/* Email Notifications */}
      <div className="slow-card">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="w-5 h-5 text-slow-blue" />
          <h3 className="font-medium text-slow-dark">Email Notifications</h3>
          {serverStatus === 'checking' && (
            <span className="text-xs text-gray-500">Checking server...</span>
          )}
          {serverStatus === 'online' && (
            <span className="text-xs text-green-600">Server online</span>
          )}
          {serverStatus === 'offline' && (
            <span className="text-xs text-red-600">Server offline</span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Receive gentle email reminders when your daily mood logging window opens.
        </p>

        {serverStatus === 'offline' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Email notifications are currently unavailable. Please ensure the backend server is running.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slow-dark mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={localSettings.emailNotifications?.email || ''}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                emailNotifications: {
                  ...prev.emailNotifications!,
                  email: e.target.value
                }
              }))}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slow-blue focus:border-transparent"
              disabled={serverStatus === 'offline'}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLocalSettings(prev => ({
                ...prev,
                emailNotifications: {
                  ...prev.emailNotifications!,
                  enabled: !prev.emailNotifications?.enabled
                }
              }))}
              disabled={!localSettings.emailNotifications?.email || serverStatus === 'offline'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                localSettings.emailNotifications?.enabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${(!localSettings.emailNotifications?.email || serverStatus === 'offline') ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {localSettings.emailNotifications?.enabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
              <span>
                {localSettings.emailNotifications?.enabled ? 'Notifications Enabled' : 'Notifications Disabled'}
              </span>
            </button>

            {emailStatus === 'loading' && (
              <span className="text-sm text-gray-500">Saving...</span>
            )}
            {emailStatus === 'success' && (
              <span className="text-sm text-green-600">Saved!</span>
            )}
            {emailStatus === 'error' && (
              <span className="text-sm text-red-600">Failed to save</span>
            )}
          </div>

          {localSettings.emailNotifications?.enabled && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You'll receive an email notification when your daily logging window opens 
                (between {timeUtils.formatHour(localSettings.dailyWindowStart)} and {timeUtils.formatHour(localSettings.dailyWindowEnd)}).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Logging Window */}
      <div className="slow-card">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-slow-blue" />
          <h3 className="font-medium text-slow-dark">Daily Logging Window</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Choose when you'd like the app to potentially invite you to log your mood each day.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slow-dark mb-2">
              Start Time
            </label>
            <select
              value={localSettings.dailyWindowStart}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                dailyWindowStart: Number(e.target.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slow-blue focus:border-transparent"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {formatHour(i)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slow-dark mb-2">
              End Time
            </label>
            <select
              value={localSettings.dailyWindowEnd}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                dailyWindowEnd: Number(e.target.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slow-blue focus:border-transparent"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {formatHour(i)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The app will randomly select one hour within this window each day 
            when you can log your mood. This creates anticipation and encourages mindful reflection.
          </p>
          <p className="text-sm text-blue-700 mt-2">
            <strong>Today's window:</strong> {timeUtils.getTodayLoggingWindowDisplay(localSettings.dailyWindowStart, localSettings.dailyWindowEnd)}
          </p>
        </div>
      </div>

      {/* Data Management */}
      <div className="slow-card">
        <div className="flex items-center space-x-2 mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="font-medium text-slow-dark">Data Management</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          All your mood data is stored locally on your device. You can clear it at any time.
        </p>
        
        <button
          onClick={() => setShowClearData(true)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
        >
          Clear All Data
        </button>
      </div>

      {/* Clear Data Confirmation */}
      {showClearData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-slow-dark mb-2">Clear All Data?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete all your mood entries and reset your settings. 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearData(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Philosophy Note */}
      <div className="text-center text-xs text-gray-500 space-y-2">
        <p>
          "Slow technology is not about doing things slowly, but about creating space for reflection 
          and meaning-making in our digital interactions."
        </p>
      </div>
    </div>
  );
};

export default SettingsView; 