/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Following the calm, lightweight, and visually breathable design principles.
 * Color palette inspired by soft, non-flashy tones.
 */

const tintColorLight = '#5F488B'; // Deep purple from palette
const tintColorDark = '#9089D4'; // Lighter purple for dark mode

export const Colors = {
  light: {
    text: '#2D2D2D', // Softer than pure black
    background: '#FEFEFE', // Slightly off-white, more breathable than pure white
    tint: tintColorLight,
    icon: '#6B7280', // Soft gray
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    // App specific colors - following calm, soft design
    cardBackground: '#FFFFFF',
    borderColor: '#F2EFFF', // Very light purple tint
    placeholderText: '#9CA3AF',
    subtitleText: '#6B7280',
    dangerColor: '#FCE8E8', // Soft pink from palette, very muted
    successColor: '#4A4E74', // Soft blue-gray from palette  
    warningColor: '#9089D4', // Soft purple from palette
    // New colors from palette
    primaryPurple: '#5F488B',
    secondaryPurple: '#4A4E74', 
    lightPurple: '#9089D4',
    softPink: '#FCE8E8',
    lightBlue: '#ABC1FF',
    // Surface colors for breathable design
    surfaceBackground: '#FBFBFB',
    cardShadow: 'rgba(95, 72, 139, 0.08)', // Soft purple shadow
    accentBackground: '#F2EFFF', // Very light purple for highlights
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    // App specific colors
    cardBackground: '#1F2937',
    borderColor: '#374151',
    placeholderText: '#6B7280',
    subtitleText: '#9CA3AF',
    dangerColor: '#5F488B', // Using purple in dark mode for consistency
    successColor: '#9089D4',
    warningColor: '#ABC1FF',
    // Dark mode versions
    primaryPurple: '#9089D4',
    secondaryPurple: '#ABC1FF',
    lightPurple: '#5F488B',
    softPink: '#4A4E74',
    lightBlue: '#ABC1FF',
    surfaceBackground: '#1F2937',
    cardShadow: 'rgba(144, 137, 212, 0.15)',
    accentBackground: '#374151',
  },
};
