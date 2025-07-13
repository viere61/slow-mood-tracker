import React, { useState, useEffect } from 'react';
import { Music, ArrowLeft, RefreshCw, Calendar, Heart } from 'lucide-react';
import { MoodEntry } from '../types';
import { storage } from '../utils/storage';
import { timeUtils } from '../utils/timeUtils';

interface ReviewViewProps {
  onBack: () => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ onBack }) => {
  const [revealedEntry, setRevealedEntry] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const revealRandomMood = () => {
    setIsLoading(true);
    const entries = storage.getMoodEntries();
    
    if (entries.length === 0) {
      setRevealedEntry(null);
      setIsLoading(false);
      return;
    }

    // Simulate a brief loading delay for anticipation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * entries.length);
      setRevealedEntry(entries[randomIndex]);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    revealRandomMood();
  }, []);

  const getMoodColor = (value: number) => {
    if (value <= 2) return 'text-red-600';
    if (value <= 4) return 'text-orange-600';
    if (value <= 6) return 'text-yellow-600';
    if (value <= 8) return 'text-green-600';
    return 'text-blue-600';
  };

  const getMoodLabel = (value: number) => {
    if (value <= 2) return 'Very Unpleasant';
    if (value <= 4) return 'Unpleasant';
    if (value <= 6) return 'Neutral';
    if (value <= 8) return 'Pleasant';
    return 'Very Pleasant';
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
        <h2 className="text-xl font-medium text-slow-dark">Past Mood Reveal</h2>
        <button
          onClick={revealRandomMood}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-slow-dark transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="slow-card text-center py-12">
          <div className="animate-pulse space-y-4">
            <Music className="w-12 h-12 text-slow-blue mx-auto" />
            <p className="text-gray-600">Revealing a moment from your past...</p>
          </div>
        </div>
      ) : revealedEntry ? (
        <div className="space-y-6">
          {/* Date */}
          <div className="slow-card bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2 text-blue-700">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{timeUtils.formatDate(revealedEntry.date)}</span>
            </div>
          </div>

          {/* Mood Value */}
          <div className="slow-card">
            <div className="text-center space-y-2">
              <div className={`text-4xl font-light ${getMoodColor(revealedEntry.moodValue)}`}>
                {revealedEntry.moodValue}/10
              </div>
              <p className="text-sm text-gray-600">{getMoodLabel(revealedEntry.moodValue)}</p>
            </div>
          </div>

          {/* Song - The Focus */}
          <div className="slow-card bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center space-y-4">
              <Music className="w-12 h-12 text-slow-blue mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-slow-dark">{revealedEntry.song.title}</h3>
                <p className="text-gray-600">{revealedEntry.song.artist}</p>
              </div>
              <p className="text-sm text-gray-500 italic">
                "This song captured your mood on {timeUtils.formatDate(revealedEntry.date)}"
              </p>
            </div>
          </div>

          {/* Descriptors */}
          {revealedEntry.descriptors.length > 0 && (
            <div className="slow-card">
              <h4 className="text-sm font-medium text-slow-dark mb-3">Mood Descriptors</h4>
              <div className="flex flex-wrap gap-2">
                {revealedEntry.descriptors.map(descriptor => (
                  <span
                    key={descriptor}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize"
                  >
                    {descriptor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contexts */}
          {revealedEntry.contexts.length > 0 && (
            <div className="slow-card">
              <h4 className="text-sm font-medium text-slow-dark mb-3">Influencing Factors</h4>
              <div className="flex flex-wrap gap-2">
                {revealedEntry.contexts.map(context => (
                  <span
                    key={context}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {context}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Thoughts */}
          {revealedEntry.thoughts && (
            <div className="slow-card">
              <h4 className="text-sm font-medium text-slow-dark mb-3">Your Thoughts</h4>
              <p className="text-gray-700 italic">"{revealedEntry.thoughts}"</p>
            </div>
          )}

          {/* Reflection Prompt */}
          <div className="slow-card bg-yellow-50 border-yellow-200">
            <div className="text-center space-y-3">
              <Heart className="w-6 h-6 text-yellow-600 mx-auto" />
              <p className="text-sm text-yellow-800">
                Take a moment to reflect on this past mood. How does it relate to where you are now?
              </p>
              <p className="text-xs text-yellow-700">
                Consider listening to "{revealedEntry.song.title}" again to deepen your reflection.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="slow-card text-center py-12">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No mood entries found yet.</p>
          <p className="text-sm text-gray-500 mt-2">Start logging your moods to see them here.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewView; 