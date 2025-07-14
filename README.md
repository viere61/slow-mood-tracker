<<<<<<< HEAD
# Slow Sonic Mood Tracker

A mindful mood tracking application that embodies the principles of slow technology, encouraging deeper self-reflection through music and intentional engagement with our emotional states.

## Philosophy

This application is inspired by the theory of slow technology, which emphasizes:

- **Explicit Slowness**: The app operates on its own time, not the user's
- **Ongoingness**: Continuous accumulation of data over time creates meaning
- **Pre-interaction**: Anticipation before logging or reviewing enhances reflection
- **Amplified Presence of Time**: Technology that invites contemplation rather than quick consumption

## Key Features

### 🕐 Time-Gated Logging
- The app only allows mood logging within a randomly selected 1-hour window each day
- Users define their preferred daily range (e.g., 9 AM - 10 PM)
- Creates anticipation and encourages mindful engagement

### 🎵 Music as Reflective Anchor
- Each mood entry includes a song that reflects the user's emotional state
- Music serves as a qualitative, evocative complement to numerical mood data
- Encourages active engagement with music choices and their emotional impact

### 👁️ Random Revelation Review
- No chronological timeline or graphs
- Users can only access past moods through "Reveal Random Past Mood"
- Focuses on the song associated with each revealed mood
- Limited revelations maintain scarcity and value

### 🧘 Mindful Interface
- Clean, minimalist design that doesn't rush the user
- Thoughtful prompts and reflection questions
- Emphasis on the qualitative over the quantitative

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd slow-mood-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Usage

### First Time Setup
1. Open the app and navigate to Settings
2. Configure your daily logging window (e.g., 9 AM - 10 PM)
3. Optionally enable email notifications

### Daily Mood Logging
1. Wait for the app to indicate that logging is available (green "Logging Open" indicator)
2. Tap "Log My Mood" when the invitation appears
3. Use the slider to rate your mood (1-10 scale)
4. Select mood descriptors and influencing factors
5. Enter a song that reflects your current mood
6. Add optional thoughts or reflections
7. Save your entry

### Reviewing Past Moods
1. Tap "Reveal Random Past Mood" from the home screen
2. Wait for the app to randomly select and display a past entry
3. Focus on the song associated with the revealed mood
4. Reflect on how that past moment relates to your current state
5. Consider listening to the song again outside the app

## Design Principles

### Slow Technology Implementation
- **Explicit Slowness**: Time-gated access creates intentional pauses
- **Ongoingness**: Data accumulates meaningfully over time
- **Pre-interaction**: Anticipation enhances the reflective experience
- **Amplified Time**: The app makes time visible and meaningful

### User Experience
- **Mindful Engagement**: Interface encourages thoughtful interaction
- **Serendipitous Discovery**: Random revelations create unexpected insights
- **Qualitative Focus**: Emphasis on music and reflection over data visualization
- **Controlled Access**: Limited review options maintain value and scarcity

## Technical Architecture

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with local storage
- **Icons**: Lucide React
- **Date Handling**: date-fns library

## Data Privacy

- All data is stored locally on the user's device
- No data is transmitted to external servers
- Users can clear all data at any time through settings
- No tracking or analytics

## Future Enhancements

- Spotify API integration for enhanced music discovery
- Export functionality for mood data
- Custom mood descriptors and context categories
- Collaborative mood sharing features
- Advanced reflection prompts and guided meditations

## Contributing

This project is designed as a research prototype exploring slow technology principles in digital mood tracking. Contributions that align with the philosophical approach are welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Research Context

This application is part of research exploring how slow technology principles can be applied to digital wellness and mental health applications. It challenges conventional fast-paced interfaces by creating space for reflection and meaning-making in our digital interactions.

## Acknowledgments

- Inspired by the theory of slow technology introduced in "Slow technology–designing for reflection"
- Built with modern web technologies for accessibility and cross-platform compatibility
- Designed with mindfulness and intentional technology use in mind 
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> d873b2b (2nd version, now: 1) added time gating function 2) able to delete all data or reset today's log status)
