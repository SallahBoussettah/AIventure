# AIventure

An AI-powered text-based adventure game built with React Native and Expo.

## Author
Salah eddine boussettah

## Features

- Dynamic story generation using Google's Gemini AI
- Immersive text-based gameplay with multiple choice options
- AI-generated scene descriptions
- Dark theme optimized for mobile
- Cross-platform support (iOS, Android, Web)

## Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Gemini API key in `src/services/geminiService.ts`

## Required Assets

Add the following images to the `assets` folder:

- `icon.png` - App icon (1024x1024px)
- `favicon.png` - Web favicon (32x32px) 
- `splash.png` - Splash screen (1284x2778px or 1080x1920px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024px)

## Fonts

Add the following Inter font files to `assets/fonts/`:

- `Inter-Regular.ttf`
- `Inter-Medium.ttf` 
- `Inter-Bold.ttf`

## Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Run on web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/          # App constants and theme
├── context/           # React Context providers
├── screens/           # Screen components
├── services/          # API services
└── types/             # TypeScript type definitions
```

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- Google Gemini AI
- Expo Linear Gradient
- Expo Image