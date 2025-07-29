module.exports = ({ config }) => {
  const projectId = "afb1f6c9-afee-4568-9a05-b55d9e834064";

  return {
    ...config,
    expo: {
      ...config.expo,
      slug: "FridgeBuddy",
      owner: "talhaatif573",  // 👈 This is what EAS wanted
      projectId, // 👈 This is critical
         android: {
        ...config.expo?.android,
        package: "com.talhaatif573.FridgeBuddy", // 👈 Add this line
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
        permissions: [
          "android.permission.CAMERA",
          "android.permission.RECORD_AUDIO",
        ],
      },
      extra: {
        ...config.expo?.extra,
        DETECTION_KEY: process.env.DETECTION_KEY,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        developerName: "xyz",
        router: {
          origin: false,
        },
        eas: {
          projectId, // Still keep inside `extra` for backward compatibility
        },
      },
    },
  };
};
