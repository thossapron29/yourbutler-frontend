import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * Custom hook for gentle page transitions
 * Creates smooth enter/exit animations consistent with brand tone
 */

export interface TransitionConfig {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
}

export const usePageTransition = (config: TransitionConfig = {}) => {
  const {
    duration = 250,
    delay = 0,
    easing = Easing.out(Easing.cubic),
  } = config;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Enter animation
  const animateIn = useCallback(() => {
    // Reset values
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    scaleAnim.setValue(0.95);

    // Gentle enter animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: duration * 0.8, // Slightly faster slide
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration * 0.6, // Even faster scale
          easing,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, [fadeAnim, slideAnim, scaleAnim, duration, delay, easing]);

  // Exit animation
  const animateOut = useCallback((callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: duration * 0.6,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: duration * 0.6,
        easing,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
    });
  }, [fadeAnim, slideAnim, duration, easing]);

  // Trigger animation when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      animateIn();
      
      return () => {
        // Cleanup when leaving
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        scaleAnim.setValue(0.95);
      };
    }, [animateIn, fadeAnim, slideAnim, scaleAnim])
  );

  return {
    // Animation values for use in components
    fadeAnim,
    slideAnim,
    scaleAnim,
    
    // Control functions
    animateIn,
    animateOut,
    
    // Combined transform style
    animatedStyle: {
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim },
      ],
    },
    
    // Individual styles for more control
    fadeStyle: { opacity: fadeAnim },
    slideStyle: { transform: [{ translateY: slideAnim }] },
    scaleStyle: { transform: [{ scale: scaleAnim }] },
  };
};

/**
 * Preset configurations for different types of screens
 */
export const TransitionPresets = {
  // Main pages (Home, My Items, Shopping List)
  page: {
    duration: 250,
    delay: 0,
    easing: Easing.out(Easing.cubic),
  },
  
  // Modal-like screens (Settings, Notifications)
  modal: {
    duration: 200,
    delay: 50,
    easing: Easing.out(Easing.quad),
  },
  
  // Quick screens (Add Product, Forms)
  quick: {
    duration: 180,
    delay: 0,
    easing: Easing.out(Easing.quad),
  },
  
  // Gentle for calm experience
  gentle: {
    duration: 300,
    delay: 100,
    easing: Easing.out(Easing.sin),
  },
} as const;

/**
 * Hook for staggered list animations
 * Great for animating list items one by one
 */
export const useStaggeredAnimation = (
  itemCount: number,
  staggerDelay: number = 50
) => {
  const animations = useRef<Animated.Value[]>([]).current;

  // Initialize animations for each item
  useEffect(() => {
    animations.splice(0, animations.length);
    for (let i = 0; i < itemCount; i++) {
      animations.push(new Animated.Value(0));
    }
  }, [itemCount, animations]);

  const animateIn = useCallback(() => {
    const animationPromises = animations.map((anim, index) => {
      anim.setValue(0);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(() => resolve());
        }, index * staggerDelay);
      });
    });

    return Promise.all(animationPromises);
  }, [animations, staggerDelay]);

  return {
    animations,
    animateIn,
    getItemStyle: (index: number) => ({
      opacity: animations[index] || 0,
      transform: [
        {
          translateY: animations[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }) || 0,
        },
      ],
    }),
  };
};
