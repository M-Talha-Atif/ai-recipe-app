# ai-recipe-app

add apis and configs in env and then in app.config.js in order to use inside
services under service package
make sure to add navigation while creating new file and adding its path
properly set the navigation
use expo based packages rather than native ones currently to currently avoid module not found error on device
for local build
# Generate native code
npx expo prebuild
# Build debug APK
cd android
./gradlew assembleDebug
