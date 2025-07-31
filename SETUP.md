# AIventure Setup Instructions

## Environment Setup

1. **Copy template files:**
   ```bash
   cp app.json.template app.json
   cp eas.json.template eas.json
   cp .env.example .env
   ```

2. **Add your API keys:**
   - Edit `.env` and add your `GEMINI_API_KEY`
   - Edit `app.json` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
   - Edit `app.json` and replace `YOUR_EAS_PROJECT_ID_HERE` with your EAS project ID
   - Edit `eas.json` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the app:**
   ```bash
   npx expo start
   ```

## Building APK

1. **Build for Android:**
   ```bash
   npx eas build --platform android --profile preview
   ```

## Important Notes

- Never commit `app.json`, `eas.json`, or `.env` files to git
- These files contain sensitive API keys
- Always use the template files as reference for new setups