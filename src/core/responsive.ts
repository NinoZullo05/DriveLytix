import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
// iPhone 11 Pro / X: 375 x 812
const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Scale based on width - good for padding, margin, width, horizontal spacing
 */
const scale = (size: number) => (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;

/**
 * Scale based on height - good for height, vertical spacing
 */
const verticalScale = (size: number) => (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;

/**
 * Cleanly scale font sizes or elements that need to resize but not linearly with screen size
 * factor: 0.5 means it will resize by 50% of the difference (less aggressive)
 */
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Helper to get pixel perfect width percentage
 */
const widthPct = (widthPercent: number) => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(SCREEN_WIDTH * elemWidth / 100);
};

/**
 * Helper to get pixel perfect height percentage
 */
const heightPct = (heightPercent: number) => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(SCREEN_HEIGHT * elemHeight / 100);
};

export {
    heightPct, moderateScale, scale, SCREEN_HEIGHT, SCREEN_WIDTH, verticalScale, widthPct
};

