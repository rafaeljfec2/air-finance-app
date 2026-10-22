# Air Finance Mobile (WebView)

Air Finance mobile app using Expo and React Native WebView.

## Features

- Loads the web app inside a WebView
- Intercepts and stores authentication tokens
- iOS and Android support
- Built with Expo for easier builds and deploys

## Available scripts

- `yarn start` — Start the Expo Metro bundler
- `yarn android` — Run on Android emulator/device
- `yarn ios` — Run on iOS simulator/device
- `yarn web` — Run in the browser (for testing)
- `yarn lint` — Run the linter
- `yarn type-check` — TypeScript type check

## Development setup

1. Make sure the web app is running at `http://localhost:5173`
2. Run `yarn start`
3. Scan the QR code with Expo Go (Android) or Camera (iOS)

## Production setup

Update the URL in `src/constants/webview.ts`:

```typescript
export const WEBSITE_URL = "https://app.airfinance.com.br";
```

## Structure

- `src/App.tsx` — Main component with WebView
- `src/components/` — Reusable components
- `src/hooks/` — Custom hooks
- `src/constants/` — Constants and configuration
- `assets/` — Icons and images

## Communication with the web app

The mobile app communicates with the web app via:

1. **postMessage**: Send messages from web to mobile
2. **injectedJavaScript**: Inject code into the WebView
3. **Expo SecureStore**: Store tokens securely

## Required assets

To publish the app, create these assets:

- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1284x2778 for iOS, 1920x3840 for Android)
- `assets/adaptive-icon.png` (1024x1024)
- `assets/favicon.png` (48x48)

## Production build

Use EAS Build for production builds:

```bash
# Configure EAS
npx eas-cli login
npx eas build:configure

# Android build
yarn build:android

# iOS build
yarn build:ios
```
