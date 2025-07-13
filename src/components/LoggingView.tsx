import React, { useState } from 'react';
import { Music, X, Save } from 'lucide-react';
import { MoodEntry, SongInfo, MOOD_DESCRIPTORS, CONTEXT_CATEGORIES } from '../types';
import { timeUtils } from '../utils/timeUtils';

interface LoggingViewProps {
  onMoodLogged: (entry: MoodEntry) => void;
  onCancel: () => void;
}

const LoggingView: React.FC<LoggingViewProps> = ({ onMoodLogged, onCancel }) => {
  const [moodValue, setMoodValue] = useState(5);
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>([]);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [thoughts, setThoughts] = useState('');

  const handleDescriptorToggle = (descriptor: string) => {
    setSelectedDescriptors(prev => 
      prev.includes(descriptor) 
        ? prev.filter(d => d !== descriptor)
        : [...prev, descriptor]
    );
  };

  const handleContextToggle = (context: string) => {
    setSelectedContexts(prev => 
      prev.includes(context) 
        ? prev.filter(c => c !== context)
        : [...prev, context]
    );
  };

  const handleSubmit = () => {
    const song: SongInfo = {
      title: songTitle.trim(),
      artist: songArtist.trim(),
    };

    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: timeUtils.getCurrentDate(),
      moodValue,
      descriptors: selectedDescriptors,
      contexts: selectedContexts,
      song,
      thoughts: thoughts.trim() || undefined,
    };

    onMoodLogged(entry);
  };

  const getMoodLabel = (value: number) => {
    if (value <= 2) return 'Very Unpleasant';
    if (value <= 4) return 'Unpleasant';
    if (value <= 6) return 'Neutral';
    if (value <= 8) return 'Pleasant';
    return 'Very Pleasant';
  };

  const canSubmit = songTitle.trim() && songArtist.trim();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-slow-dark">Log Your Mood</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-slow-dark transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mood Slider */}
      <div className="slow-card">
        <label className="block text-sm font-medium text-slow-dark mb-3">
          How are you feeling right now?
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="1"
            max="10"
            value={moodValue}
            onChange={(e) => setMoodValue(Number(e.target.value))}
            className="mood-slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Very Unpleasant</span>
            <span className="font-medium text-slow-dark">{getMoodLabel(moodValue)}</span>
            <span>Very Pleasant</span>
          </div>
        </div>
      </div>

      {/* Mood Descriptors */}
      <div className="slow-card">
        <label className="block text-sm font-medium text-slow-dark mb-3">
          What words describe your mood?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MOOD_DESCRIPTORS.map(descriptor => (
            <label key={descriptor} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDescriptors.includes(descriptor)}
                onChange={() => handleDescriptorToggle(descriptor)}
                className="rounded text-slow-blue focus:ring-slow-blue"
              />
              <span className="text-sm capitalize">{descriptor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Context Categories */}
      <div className="slow-card">
        <label className="block text-sm font-medium text-slow-dark mb-3">
          What's influencing your mood today?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONTEXT_CATEGORIES.map(context => (
            <label key={context} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedContexts.includes(context)}
                onChange={() => handleContextToggle(context)}
                className="rounded text-slow-blue focus:ring-slow-blue"
              />
              <span className="text-sm">{context}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Song Selection */}
      <div className="slow-card">
        <label className="block text-sm font-medium text-slow-dark mb-3">
          <Music className="w-4 h-4 inline mr-1" />
          What song reflects your mood?
        </label>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Song title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slow-blue focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Artist"
            value={songArtist}
            onChange={(e) => setSongArtist(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slow-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Additional Thoughts */}
      <div className="slow-card">
        <label className="block text-sm font-medium text-slow-dark mb-3">
          Any additional thoughts? (optional)
        </label>
        <textarea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Reflect on your mood, the song choice, or anything else..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slow-blue focus:border-transparent resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full slow-button-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        <span>Save Mood Entry</span>
      </button>
    </div>
  );
};

export default LoggingView; 