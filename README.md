# Slow Sonic Mood Tracker

A mindful, local-only web app for tracking your emotional journey through music. No backend, no email notifications—just a simple, private tool for self-reflection.

## Features
- Log your daily mood with a 1–10 scale
- Associate a song with each mood entry (search via iTunes API)
- Add optional thoughts or reflections
- Review a random past mood entry for reflection
- All data is stored locally in your browser (no cloud, no accounts)
- Customizable daily logging window

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)

### Installation
1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd slow-mood-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the local development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Usage
- Click "Log My Mood" to record your mood and a song.
- Click "Reveal Random Past Mood" to reflect on a previous entry.
- Use the Settings to adjust your daily logging window or clear all data.

### Data Privacy
All data is stored in your browser's local storage. Nothing is sent to any server.

## Project Structure
- `src/` — Main frontend source code (React, TypeScript)
- `public/` — Static assets
- `index.html` — Main HTML entry point
