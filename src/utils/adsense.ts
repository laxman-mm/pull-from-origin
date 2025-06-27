
/**
 * Utility functions for working with Google AdSense
 */

/**
 * Manually refreshes ads on the page
 * Call this function after dynamically loading content or after route changes
 */
export const refreshAds = () => {
  if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
    try {
      window.adsbygoogle.push({});
    } catch (e) {
      console.error("Error refreshing ads:", e);
    }
  }
};

/**
 * Check if AdSense is loaded and ready
 */
export const isAdSenseLoaded = (): boolean => {
  return !!window.adsbygoogle;
};
