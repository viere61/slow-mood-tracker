import React, { useState } from 'react';
import { ArrowLeft, Clock, Mail, Trash2 } from 'lucide-react';
import { UserSettings } from '../types';
import { storage } from '../utils/storage';

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

  const handleSave = () => {
    onSettingsUpdate(localSettings);
  };

  const handleClearData = () => {
    storage.clearAllData();
    setShowClearData(false);
    // Reset to default settings
    const defaultSettings: UserSettings = {
      dailyWindowStart: 9,
      dailyWindowEnd: 22,
      emailNotifications: false,
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
        </div>
      </div>

      {/* Email Notifications */}
      <div className="slow-card">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="w-5 h-5 text-slow-blue" />
          <h3 className="font-medium text-slow-dark">Email Notifications</h3>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.emailNotifications}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                emailNotifications: e.target.checked
              }))}
              className="rounded text-slow-blue focus:ring-slow-blue"
            />
            <span className="text-sm">Enable email notifications</span>
          </label>
          
          {localSettings.emailNotifications && (
            <div>
              <label className="block text-sm font-medium text-slow-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={localSettings.email || ''}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slow-blue focus:border-transparent"
              />
            </div>
          )}
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