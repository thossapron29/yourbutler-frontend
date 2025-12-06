/**
 * 🎨 YourButler Design System
 * 
 * Extracted from Figma Design: "YourButler (Copy)"
 * Last Updated: October 11, 2025
 * 
 * This file contains the complete design system including:
 * - Color palette
 * - Typography scale
 * - Spacing system
 * - Border radius
 * - Shadows and effects
 */

// ============================================================================
// 🎨 COLOR PALETTE
// ============================================================================

export const ColorPalette = {
  // Primary Purple Shades
  purple: {
    50: '#F2EFFF',   // Very light purple for backgrounds
    100: '#E6DAFF',  // Light purple tint
    200: '#D4BBEF',  // Soft purple
    300: '#9089D4',  // Light purple (extracted from Figma)
    400: '#8655BB',  // Medium purple
    500: '#5F488B',  // Primary purple (brand color)
    600: '#573B97',  // Darker purple
    700: '#4D2FA0',  // Deep purple
    800: '#291143',  // Very dark purple
    900: '#211951',  // Almost black purple
  },

  // Blue Shades (from Figma)
  blue: {
    50: '#F0F4FF',
    100: '#E6F0FF',
    200: '#ABC1FF',  // Light blue (extracted)
    300: '#8ED7F4',  // Sky blue
    400: '#78BAC7',  // Teal blue
    500: '#6CA2DB',  // Medium blue
    600: '#6697DD',  // Bright blue
    700: '#5E87CA',  // Deep blue
    800: '#518EF8',  // Vivid blue
    900: '#263681',  // Dark blue
  },

  // Green Shades (Success colors from Figma)
  green: {
    50: '#F0FFF4',
    100: '#E8F9ED',
    200: '#88CD99',  // Light green
    300: '#78BF82',  // Soft green
    400: '#81D14E',  // Lime green
    500: '#43EA71',  // Bright green
    600: '#28B446',  // Medium green
    700: '#427535',  // Deep green
    800: '#436B1C',  // Dark green
    900: '#25412C',  // Very dark green
  },

  // Pink/Lavender Shades
  pink: {
    50: '#FCE8E8',   // Soft pink (from current palette)
    100: '#F8E5F4',  // Light lavender
    200: '#E6DAFA',  // Lavender tint
    300: '#D4BBEF',  // Purple-pink
    400: '#C3AEF0',  // Medium lavender
  },

  // Neutral/Gray Shades
  gray: {
    50: '#FEFEFE',   // Off-white background
    100: '#FBFBFB',  // Surface background
    200: '#F9FAFB',  // Light gray
    300: '#E5E7EB',  // Border gray
    400: '#D1D5DB',  // Subtle border
    500: '#9CA3AF',  // Placeholder text
    600: '#6B7280',  // Subtitle text
    700: '#4B5563',  // Secondary text
    800: '#374151',  // Dark gray
    900: '#2D2D2D',  // Primary text
    950: '#1F2937',  // Almost black
  },

  // Semantic Colors
  semantic: {
    // Success
    success: {
      light: '#88CD99',
      DEFAULT: '#28B446',
      dark: '#427535',
    },
    // Warning
    warning: {
      light: '#FFE8B3',
      DEFAULT: '#F59E0B',
      dark: '#D97706',
    },
    // Error/Danger
    error: {
      light: '#FCE8E8',
      DEFAULT: '#EF4444',
      dark: '#DC2626',
    },
    // Info
    info: {
      light: '#ABC1FF',
      DEFAULT: '#518EF8',
      dark: '#263681',
    },
  },

  // System Colors (iOS/Android native colors found in Figma)
  system: {
    blue: '#007AFF',    // iOS blue
    separator: 'rgba(60, 60, 67, 0.36)',
    labelPrimary: '#000000',
    labelSecondary: 'rgba(60, 60, 67, 0.6)',
    labelTertiary: 'rgba(60, 60, 67, 0.3)',
  }
} as const;

// ============================================================================
// 📝 TYPOGRAPHY SYSTEM
// ============================================================================

export const Typography = {
  // Font Families (extracted from Figma)
  fontFamily: {
    primary: 'Figtree',    // Main app font
    secondary: 'Nunito',   // Alternative font (Thai support)
    thai: 'Anuphan',       // Thai-specific font
    mono: 'SF Pro',        // Monospace/system font
  },

  // Font Sizes (based on Figma usage)
  fontSize: {
    xs: 8,      // Tiny labels
    sm: 12,     // Small text, captions
    base: 14,   // Body text, base size
    md: 16,     // Medium text, buttons
    lg: 17,     // Large body text
    xl: 20,     // Section headers
    '2xl': 24,  // Page titles
    '3xl': 32,  // Large titles
    '4xl': 40,  // Extra large titles
    '5xl': 44,  // Hero text
    '6xl': 64,  // Display text
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights (calculated from Figma)
  lineHeight: {
    tight: 1.1,     // 110%
    snug: 1.2,      // 120%
    normal: 1.5,    // 150%
    relaxed: 1.625, // 162.5%
    loose: 2,       // 200%
  },

  // Letter Spacing (extracted from Figma)
  letterSpacing: {
    tighter: -0.5,
    tight: -0.44,
    normal: 0,
    wide: 0.025,
  },

  // Typography Presets (Common patterns from Figma)
  presets: {
    // Display styles
    displayLarge: {
      fontFamily: 'Figtree',
      fontSize: 64,
      fontWeight: '400',
      lineHeight: 76.8,
      letterSpacing: 0,
    },
    displayMedium: {
      fontFamily: 'Figtree',
      fontSize: 44,
      fontWeight: '500',
      lineHeight: 48.4,
      letterSpacing: -0.44,
    },

    // Heading styles
    h1: {
      fontFamily: 'Nunito',
      fontSize: 44,
      fontWeight: '500',
      lineHeight: 48.4,
      letterSpacing: -0.44,
    },
    h2: {
      fontFamily: 'Figtree',
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 48,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: 'Figtree',
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 38.4,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: 'Figtree',
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 28.8,
      letterSpacing: 0,
    },
    h5: {
      fontFamily: 'Figtree',
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 24,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: 'Nunito',
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: -0.43,
    },

    // Body styles
    bodyLarge: {
      fontFamily: 'Figtree',
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    bodyMedium: {
      fontFamily: 'Figtree',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 19.2,
      letterSpacing: 0,
    },
    bodyRegular: {
      fontFamily: 'Figtree',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 25,
      letterSpacing: -0.45,
    },
    bodySmall: {
      fontFamily: 'Figtree',
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 14.4,
      letterSpacing: 0,
    },

    // Label/Caption styles
    label: {
      fontFamily: 'Figtree',
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18,
      letterSpacing: 0,
    },
    caption: {
      fontFamily: 'Figtree',
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 14.4,
      letterSpacing: 0,
    },
    captionSmall: {
      fontFamily: 'Nunito',
      fontSize: 8,
      fontWeight: '400',
      lineHeight: 10.9,
      letterSpacing: 0,
    },
  },
} as const;

// ============================================================================
// 📏 SPACING SYSTEM
// ============================================================================

export const Spacing = {
  // Base spacing unit: 4px
  // Most common values extracted from Figma
  px: 1,
  0: 0,
  1: 4,      // 4px - very common in Figma
  2: 8,      // 8px - common spacing
  3: 12,     // 12px - MOST COMMON (padding & gaps)
  4: 16,     // 16px - very common padding
  5: 20,     // 20px
  6: 24,     // 24px - section spacing
  7: 28,     // 28px
  8: 32,     // 32px - large spacing
  10: 40,    // 40px
  11: 44,    // 44px - specific spacing
  12: 48,    // 48px
  16: 64,    // 64px
  20: 80,    // 80px
  24: 96,    // 96px

  // Semantic spacing names
  xs: 4,     // Extra small
  sm: 8,     // Small
  md: 12,    // Medium (most common)
  lg: 16,    // Large
  xl: 24,    // Extra large
  '2xl': 32, // 2x extra large
  '3xl': 44, // 3x extra large
  '4xl': 64, // 4x extra large

  // Gap spacing (for flexbox/grid)
  gap: {
    xs: 4,    // 4px - very common in Figma
    sm: 8,    // 8px
    md: 10,   // 10px - MOST COMMON gap
    lg: 12,   // 12px - common gap
    xl: 24,   // 24px
    '2xl': 32, // 32px
    '3xl': 44, // 44px
    '4xl': 66, // 66px (special case)
  },

  // Container padding (based on mobile design)
  container: {
    xs: 12,   // Tight container
    sm: 16,   // Standard mobile padding
    md: 24,   // Comfortable padding
    lg: 32,   // Wide padding
  },
} as const;

// ============================================================================
// 🔘 BORDER RADIUS
// ============================================================================

export const BorderRadius = {
  none: 0,
  xs: 2,      // 2px - subtle
  sm: 4,      // 4px - small cards
  md: 6,      // 6px - medium cards
  lg: 12,     // 12px - large cards
  xl: 16,     // 16px - very common in Figma
  '2xl': 24,  // 24px - MOST COMMON radius
  '3xl': 32,  // 32px
  full: 9999, // Fully rounded (pills, avatars)

  // Semantic names
  button: 24,      // Standard button radius
  card: 24,        // Standard card radius
  input: 16,       // Input field radius
  badge: 100,      // Badge/pill radius (very common)
  avatar: 100,     // Avatar radius
  modal: 24,       // Modal corner radius
} as const;

// ============================================================================
// 🌑 SHADOWS & EFFECTS
// ============================================================================

export const Shadows = {
  // Soft shadows (matching Figma blur effects)
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },

  // Purple-tinted shadows (brand-specific)
  purple: {
    shadowColor: '#5F488B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  // Blur effects (from Figma)
  blur: {
    subtle: 50,    // Subtle blur
    medium: 100,   // Most common blur radius
    strong: 150,   // Strong blur
  },
} as const;

// ============================================================================
// 📐 LAYOUT
// ============================================================================

export const Layout = {
  // Screen sizes (for responsive design)
  breakpoints: {
    sm: 375,   // Small phone
    md: 428,   // Standard phone (iPhone 14 Pro Max)
    lg: 768,   // Tablet
    xl: 1024,  // Large tablet/small desktop
  },

  // Component sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },

  buttonHeight: {
    sm: 32,
    md: 44,    // Common button height in Figma
    lg: 56,
  },

  inputHeight: {
    sm: 36,
    md: 44,
    lg: 56,
  },

  // Safe areas & insets
  safeArea: {
    top: 44,      // iOS status bar
    bottom: 34,   // iOS home indicator
  },
} as const;

// ============================================================================
// 🎭 OPACITY/TRANSPARENCY
// ============================================================================

export const Opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,    // Common in Figma (backgrounds)
  15: 0.15,
  20: 0.2,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  80: 0.8,
  90: 0.9,
  100: 1,
} as const;

// ============================================================================
// 🎯 HELPER FUNCTIONS
// ============================================================================

/**
 * Convert RGB color object to hex string
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
};

/**
 * Add opacity to hex color
 */
export const addOpacity = (hexColor: string, opacity: number): string => {
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${hexColor}${opacityHex}`;
};

/**
 * Get spacing value
 */
export const spacing = (multiplier: number): number => {
  return Spacing[1] * multiplier; // Base unit is 4px
};

// ============================================================================
// 📦 EXPORT DEFAULT (for convenient imports)
// ============================================================================

export default {
  ColorPalette,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  Opacity,
  // Helper functions
  rgbToHex,
  addOpacity,
  spacing,
} as const;
