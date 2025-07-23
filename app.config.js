export default ({ config }) => ({
  ...config,
  extra: {
    DETECTION_KEY: process.env.DETECTION_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
});
// env variables should be set in your .env file