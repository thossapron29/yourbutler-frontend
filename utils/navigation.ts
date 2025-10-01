import { router } from 'expo-router';
import { Href } from 'expo-router';
import { Animated, Easing } from 'react-native';
import { runOnJS } from 'react-native-reanimated';

/**
 * Navigation utilities with gentle animations
 * Consistent with calm & warm brand tone
 */

export interface NavigationOptions {
  animation?: 'gentle' | 'subtle' | 'instant';
  hapticFeedback?: boolean;
  delay?: number;
}

/**
 * Navigate with gentle animation using React Native Animated
 * Perfect for calm user experience
 */
export const navigateGently = (
  href: Href,
  options: NavigationOptions = {}
) => {
  const { animation = 'gentle', hapticFeedback = false, delay = 0 } = options;

  // Optional haptic feedback for better UX
  if (hapticFeedback) {
    // You can add Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) here
  }

  // Add a gentle delay for better perceived performance
  const navigate = () => {
    switch (animation) {
      case 'instant':
        router.replace(href);
        break;
      case 'subtle':
      case 'gentle':
      default:
        router.push(href);
        break;
    }
  };

  if (delay > 0) {
    setTimeout(navigate, delay);
  } else {
    navigate();
  }
};

/**
 * Create a gentle fade transition for any component
 */
export const createGentleTransition = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  duration: number = 250,
  callback?: () => void
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: Easing.out(Easing.cubic), // Gentle easing curve
    useNativeDriver: true,
  }).start(callback);
};

/**
 * Navigate back with gentle animation
 */
export const navigateBackGently = (options: NavigationOptions = {}) => {
  const { hapticFeedback = false, delay = 0 } = options;

  if (hapticFeedback) {
    // Optional haptic feedback
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback to home if can't go back
      router.replace('/(app)/home');
    }
  };

  if (delay > 0) {
    setTimeout(goBack, delay);
  } else {
    goBack();
  }
};

/**
 * Replace current route gently
 * Good for auth flow transitions
 */
export const replaceGently = (
  href: Href,
  options: NavigationOptions = {}
) => {
  const { hapticFeedback = false, delay = 0 } = options;

  if (hapticFeedback) {
    // Optional haptic feedback
  }

  const replace = () => {
    router.replace(href);
  };

  if (delay > 0) {
    setTimeout(replace, delay);
  } else {
    replace();
  }
};

/**
 * Animation presets for consistency
 */
export const NavigationPresets = {
  // For main navigation (tabs)
  gentle: {
    animation: 'gentle' as const,
    hapticFeedback: false,
    delay: 50, // Small delay for better perceived performance
  },
  
  // For modal-like screens
  subtle: {
    animation: 'subtle' as const,
    hapticFeedback: true,
    delay: 0,
  },
  
  // For instant transitions (like auth)
  instant: {
    animation: 'instant' as const,
    hapticFeedback: false,
    delay: 0,
  },
} as const;
