#!/bin/bash

# Termux APK Automation Cooking Script
echo "========================================="
echo "   🚀 NATIVE CAPACITOR APP CONFIGURATOR   "
echo "========================================="

# 1. Prompt user for interactive inputs
read -p "📝 Enter the App Name (e.g., My App): " APP_NAME
read -p "🆔 Enter the App ID (e.g., com.example.app): " APP_ID
read -p "🖼️  Enter the path to your Logo PNG (e.g., public/logo.png): " LOGO_PATH

# Check if the specified logo file actually exists
if [ ! -f "$LOGO_PATH" ]; then
    echo "❌ Error: Logo file not found at '$LOGO_PATH'!"
    exit 1
fi

echo -e "\n🔄 Step 1: Updating master capacitor.config.json..."
cat << EOF > capacitor.config.json
{
  "appId": "$APP_ID",
  "appName": "$APP_NAME",
  "webDir": "dist"
}
EOF

echo "📦 Step 2: Compiling web production bundles..."
npm run build

echo "🔄 Step 3: Syncing distribution web assets to native container..."
npx cap sync android

echo "🔧 Step 4: Injecting custom configuration variables into Android files..."
# Update the app name string asset inside strings.xml cleanly using custom delimiters
STRINGS_FILE="android/app/src/main/res/values/strings.xml"
if [ -f "$STRINGS_FILE" ]; then
    # Sanitize any apostrophes for Android's XML compiler
    SAFE_NAME=$(echo "$APP_NAME" | sed "s/'/\&#39;/g")
    sed -i "s|<string name=\"app_name\">.*</string>|<string name=\"app_name\">$SAFE_NAME</string>|g" "$STRINGS_FILE"
    echo "  ✅ App name string successfully set to: $SAFE_NAME"
fi

echo "🗑️ Step 5: Removing adaptive icon configurations to prevent compilation conflicts..."
rm -rf android/app/src/main/res/mipmap-anydpi-v26

echo "🎨 Step 6: Injecting app custom brand icons across density pools..."
for dir in android/app/src/main/res/mipmap-*; do
    if [ -d "$dir" ]; then
        cp "$LOGO_PATH" "$dir/ic_launcher.png"
        cp "$LOGO_PATH" "$dir/ic_launcher_round.png"
    fi
done
echo "  ✅ Icon layout injected perfectly."

echo "📤 Step 7: Staging changes and dispatching to GitHub pipeline..."
git add capacitor.config.json android/ package.json package-lock.json
git commit -m "chore: automated compilation dispatch for $APP_NAME"
git push origin master

echo "========================================="
echo " 🎉 CONFIGURATION DISPATCHED SUCCESSFULLY! "
echo "========================================="
echo "Check your GitHub Actions tab to fetch your compiled artifact."

