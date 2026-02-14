# Periyar Scale App - Complete Setup Guide

## Prerequisites

### 1. Install Node.js
Download and install Node.js 18+ from: https://nodejs.org/

**Verify Installation:**
```bash
node --version  # Should be 18 or higher
npm --version
```

### 2. Install Android Studio & Java JDK

**Download Android Studio:**
- https://developer.android.com/studio
- Install Android SDK (API level 33 or higher)
- Install Android SDK Build-Tools
- Install Android Emulator (optional)

**Install Java JDK 17:**
- Download from: https://adoptium.net/
- Set JAVA_HOME environment variable

**Verify Installation:**
```bash
java -version  # Should be 17 or higher
```

### 3. Configure Android Environment Variables

Add to your system PATH:
```
ANDROID_HOME = C:\Users\{YOUR_USERNAME}\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

---

## Project Setup

### 1. Navigate to Project
```bash
cd C:\Users\HP\Downloads\periyar_app
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- React Native 0.73.2
- TypeScript 5.3
- React Navigation
- Axios (for HTTP requests)
- AsyncStorage (for token storage)
- WebSocket support
- Vector Icons

### 3. Configure Backend URL

**Edit:** `src/config/api.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:3000',  // Replace with your backend IP
  WS_URL: 'ws://192.168.1.100:3000/ws',   // Replace with your WebSocket URL
  
  ENDPOINTS: {
    LOGIN: '/login',
    WEIGHTS: '/weights',
  },
  
  TIMEOUT: 10000,
};
```

**Find your local IP address:**
```bash
ipconfig
# Look for "IPv4 Address" under your Wi-Fi or Ethernet adapter
# Example: 192.168.1.100
```

**Important:** 
- Use `http://` for local development (not `https://`)
- Use `ws://` for WebSocket (not `wss://`)
- Phone and backend must be on same Wi-Fi network
- Don't use `localhost` - use actual IP address

---

## Running the App

### Option 1: Physical Android Device

**1. Enable USB Debugging:**
- Go to Settings → About Phone
- Tap "Build Number" 7 times to enable Developer Options
- Go to Settings → Developer Options
- Enable "USB Debugging"

**2. Connect Phone via USB**

**3. Verify Device is Connected:**
```bash
adb devices
# Should show your device listed
```

**4. Start Metro Bundler (Terminal 1):**
```bash
npm start
```

**5. Run App on Device (Terminal 2):**
```bash
npm run android
```

### Option 2: Android Emulator

**1. Create Emulator in Android Studio:**
- Open Android Studio
- Tools → Device Manager
- Create Device → Pixel 5 or similar
- Select System Image: Android 13 (API 33)
- Finish

**2. Start Emulator:**
- Launch the emulator from Device Manager

**3. Run App:**
```bash
# Terminal 1
npm start

# Terminal 2
npm run android
```

---

## Build Release APK

### For Testing/Distribution

```bash
cd android
./gradlew assembleRelease
```

**APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

### For Google Play Store

```bash
cd android
./gradlew bundleRelease
```

**Bundle Location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## Troubleshooting

### Metro Bundler Issues

**Metro won't start:**
```bash
npm start -- --reset-cache
```

**Port 8081 already in use:**
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Then restart
npm start
```

### Build Errors

**Gradle build failed:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Dependencies issue:**
```bash
rm -rf node_modules
npm install
```

### Device Connection

**Device not detected:**
```bash
adb devices
# If empty, check USB cable and USB debugging is enabled
```

**Multiple devices connected:**
```bash
adb devices  # List all devices
npm run android  # Will prompt to select device
```

### WebSocket Connection

**WebSocket won't connect:**
1. Check backend server is running
2. Verify IP address in `src/config/api.ts`
3. Ensure phone and server on same network
4. Check firewall settings
5. Try with `ws://` not `wss://` for local dev

**Connection status shows "Error":**
- Check backend WebSocket endpoint is `/ws`
- Verify backend accepts WebSocket connections
- Check backend logs for errors

### Backend API Issues

**Login fails with network error:**
1. Verify backend is running
2. Check `BASE_URL` in `src/config/api.ts`
3. Test backend directly: `curl http://YOUR-IP:3000/login`
4. Ensure phone can reach backend IP

**401 Unauthorized errors:**
- Token expired - logout and login again
- Backend JWT validation issue
- Check token is being sent in headers

---

## Development Tips

### Hot Reload
- Press `r` in Metro bundler terminal to reload
- Press `R` for full reload
- Shake device to open dev menu

### Debug Menu
- Physical Device: Shake the device
- Emulator: Press Ctrl+M (Windows) or Cmd+M (Mac)

Options:
- Enable Hot Reloading
- Enable Remote JS Debugging (Chrome DevTools)
- Toggle Inspector
- Show Performance Monitor

### Viewing Logs
```bash
# View all logs
npx react-native log-android

# Filter by tag
adb logcat | findstr "ReactNative"
```

### Clear Cache (if issues persist)
```bash
# Clear Metro bundler cache
npm start -- --reset-cache

# Clear app data on device
adb shell pm clear com.periyarscale

# Clean Android build
cd android
./gradlew clean
cd ..
```

---

## Configuration

### Change App Name

**Edit:** `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">Your App Name</string>
```

### Change Package Name

**Edit:** `android/app/build.gradle`
```gradle
defaultConfig {
    applicationId "com.yourcompany.periyarscale"
    ...
}
```

### Change App Icon

Replace files in:
```
android/app/src/main/res/
  ├── mipmap-hdpi/ic_launcher.png
  ├── mipmap-mdpi/ic_launcher.png
  ├── mipmap-xhdpi/ic_launcher.png
  ├── mipmap-xxhdpi/ic_launcher.png
  └── mipmap-xxxhdpi/ic_launcher.png
```

---

## Testing

### Manual Testing Checklist

- [ ] App launches without errors
- [ ] Login screen displays correctly
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Token persists after app restart (auto-login)
- [ ] Home screen connects to WebSocket
- [ ] Live weight updates display
- [ ] Stability detection works (< 5g for 2 seconds)
- [ ] Save weight button works
- [ ] History screen loads weight records
- [ ] Pull-to-refresh works
- [ ] Logout clears token and returns to login
- [ ] Connection status indicator works
- [ ] Auto-reconnect works after disconnect

### Network Testing

Test on different networks:
1. Same Wi-Fi as backend
2. Different Wi-Fi (should fail gracefully)
3. Mobile data (requires public backend)
4. No internet (should show appropriate errors)

---

## Performance Optimization

### Enable Hermes (JavaScript Engine)

Already enabled in `android/app/build.gradle`:
```gradle
project.ext.react = [
    enableHermes: true
]
```

### ProGuard (Code Minification)

For release builds, ProGuard is automatically enabled.

### Reduce APK Size

```bash
# Build split APKs per architecture
cd android
./gradlew assembleRelease

# Generates separate APKs for arm64-v8a, armeabi-v7a, x86, x86_64
```

---

## Security Best Practices

1. **Never commit sensitive data** to Git
2. **Use environment variables** for API URLs (consider using react-native-config)
3. **Enable ProGuard** for release builds (already configured)
4. **Use HTTPS/WSS** in production
5. **Implement token refresh** mechanism
6. **Validate all user inputs**
7. **Handle token expiration** gracefully

---

## Backend Requirements

Your backend must provide:

### REST Endpoints
- `POST /login` - Returns JWT token
- `GET /weights` - Returns weight history (requires auth)
- `POST /weights` - Saves weight record (requires auth)

### WebSocket
- `WS /ws?token=<JWT>` - Streams live weight data

See `BACKEND_API.md` for detailed API specifications.

---

## Sample Backend Setup

Quick Node.js/Express backend for testing:

```bash
# Create backend folder
mkdir periyar-backend
cd periyar-backend
npm init -y
npm install express jsonwebtoken ws cors body-parser

# Create server.js (see BACKEND_API.md for code)
node server.js
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Update `BASE_URL` to production server (HTTPS)
- [ ] Update `WS_URL` to production WebSocket (WSS)
- [ ] Generate signed APK/AAB
- [ ] Test on multiple devices
- [ ] Test on different Android versions
- [ ] Verify all features work with production backend
- [ ] Check app permissions are minimal
- [ ] Optimize images in assets
- [ ] Enable ProGuard
- [ ] Test crash reporting
- [ ] Prepare app store listing

---

## Support & Documentation

- **Quick Start:** `QUICKSTART.md`
- **API Documentation:** `BACKEND_API.md`
- **API Endpoints:** `BACKEND_ENDPOINTS.md`
- **Project Overview:** `README.md`
- **Features Overview:** `APP_OVERVIEW.md`

---

## Common Commands Reference

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Reset Metro cache
npm start -- --reset-cache

# Check connected devices
adb devices

# View Android logs
npx react-native log-android

# Build release APK
cd android && ./gradlew assembleRelease

# Clean build
cd android && ./gradlew clean

# Uninstall app from device
adb uninstall com.periyarscale
```

---

**Status:** ✅ Ready for Development  
**Platform:** Android  
**Framework:** React Native 0.73  
**Last Updated:** February 14, 2026

Need help? Check the troubleshooting section or review the other documentation files.
