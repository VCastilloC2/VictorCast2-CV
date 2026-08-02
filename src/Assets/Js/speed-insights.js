/*==================== VERCEL SPEED INSIGHTS ====================*/
// Import and initialize Vercel Speed Insights
// This tracks web vitals and performance metrics automatically
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
// Note: This only tracks data in production mode, not in development
injectSpeedInsights({
    debug: false, // Set to true to enable debug logging in development
});
