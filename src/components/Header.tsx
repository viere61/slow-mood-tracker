import React from 'react';
import { Music, Settings, Home, Clock } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: any) => void;
  canLogToday: boolean;
  isLoggingWindow: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  canLogToday, 
  isLoggingWindow 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 max-w-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Music className="w-8 h-8 text-slow-blue" />
            <div>
              <h1 className="text-xl font-semibold text-slow-dark">Slow Sonic</h1>
              <p className="text-sm text-gray-500">Mood Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentView !== 'home' && (
              <button
                onClick={() => onViewChange('home')}
                className="p-2 text-gray-500 hover:text-slow-dark transition-colors"
              >
                <Home className="w-5 h-5" />
              </button>
            )}
            
            {currentView !== 'settings' && (
              <button
                onClick={() => onViewChange('settings')}
                className="p-2 text-gray-500 hover:text-slow-dark transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            
            {isLoggingWindow && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                <Clock className="w-3 h-3" />
                <span>Logging Open</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 