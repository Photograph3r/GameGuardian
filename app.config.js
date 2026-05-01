import 'dotenv/config';

export default {
  expo: {
    name: "GameGuardian",
    slug: "GameGuardian",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#4F46E5"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gameguardian.app",
      scheme: "gameguardian",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#4F46E5"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.gameguardian.app",
      scheme: "gameguardian",
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-web-browser"
    ],
    scheme: "gameguardian",
    extra: {
      robloxClientId: process.env.ROBLOX_CLIENT_ID,
      robloxClientSecret: process.env.ROBLOX_CLIENT_SECRET,
    }
  }
};