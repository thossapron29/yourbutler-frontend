/**
 * 🎨 YourButler Color System
 * 
 * Below are the colors used in the app, defined for both light and dark modes.
 * Following calm, lightweight, and visually breathable design principles.
 * Color palette extracted from Figma design and optimized for accessibility.
 * 
 * @see DesignSystem.ts for complete design tokens
 */

import { ColorPalette } from './DesignSystem';

const tintColorLight = ColorPalette.purple[500];  // #5F488B - Primary purple
const tintColorDark = ColorPalette.purple[300];   // #9089D4 - Lighter purple for dark mode

export const Colors = {
  light: {
    // Base colors
    text: ColorPalette.gray[900],           // #2D2D2D - Primary text
    background: ColorPalette.gray[50],      // #FEFEFE - Main background
    tint: tintColorLight,                   // #5F488B - Brand color
    
    // Icons
    icon: ColorPalette.gray[600],           // #6B7280 - Default icons
    tabIconDefault: ColorPalette.gray[500], // #9CA3AF - Inactive tabs
    tabIconSelected: tintColorLight,        // #5F488B - Active tabs
    
    // App specific colors
    cardBackground: '#FFFFFF',                    // Pure white cards
    borderColor: ColorPalette.purple[50],         // #F2EFFF - Subtle purple border
    placeholderText: ColorPalette.gray[500],      // #9CA3AF - Input placeholders
    subtitleText: ColorPalette.gray[600],         // #6B7280 - Secondary text
    
    // Semantic colors
    dangerColor: ColorPalette.semantic.error.light,   // #FCE8E8 - Error/danger
    successColor: ColorPalette.semantic.success.DEFAULT, // #28B446 - Success
    warningColor: ColorPalette.semantic.warning.DEFAULT, // #F59E0B - Warning
    infoColor: ColorPalette.blue[200],            // #ABC1FF - Info
    
    // Brand colors (from Figma)
    primaryPurple: ColorPalette.purple[500],      // #5F488B
    secondaryPurple: ColorPalette.purple[700],    // #4D2FA0
    lightPurple: ColorPalette.purple[300],        // #9089D4
    softPink: ColorPalette.pink[50],              // #FCE8E8
    lightBlue: ColorPalette.blue[200],            // #ABC1FF
    
    // Surface colors for breathable design
    surfaceBackground: ColorPalette.gray[100],    // #FBFBFB - Subtle surface
    cardShadow: 'rgba(95, 72, 139, 0.08)',        // Soft purple shadow
    accentBackground: ColorPalette.purple[50],    // #F2EFFF - Accent highlights
    
    // Additional semantic colors from Figma
    backgroundBlur: ColorPalette.purple[200],     // For blur effects
    divider: ColorPalette.gray[300],              // #E5E7EB - Divider lines
    overlay: 'rgba(0, 0, 0, 0.3)',               // Dark overlay
  },
  
  dark: {
    // Base colors
    text: ColorPalette.gray[200],           // #F9FAFB - Primary text
    background: '#111827',                  // Dark background
    tint: tintColorDark,                    // #9089D4 - Brand color (lighter)
    
    // Icons
    icon: ColorPalette.gray[500],           // #9CA3AF - Default icons
    tabIconDefault: ColorPalette.gray[600], // #6B7280 - Inactive tabs
    tabIconSelected: tintColorDark,         // #9089D4 - Active tabs
    
    // App specific colors
    cardBackground: ColorPalette.gray[950],       // #1F2937 - Card background
    borderColor: ColorPalette.gray[800],          // #374151 - Borders
    placeholderText: ColorPalette.gray[600],      // #6B7280 - Placeholders
    subtitleText: ColorPalette.gray[500],         // #9CA3AF - Secondary text
    
    // Semantic colors (adjusted for dark mode)
    dangerColor: ColorPalette.semantic.error.DEFAULT,    // #EF4444
    successColor: ColorPalette.semantic.success.light,   // #88CD99
    warningColor: ColorPalette.semantic.warning.DEFAULT, // #F59E0B
    infoColor: ColorPalette.blue[200],            // #ABC1FF
    
    // Brand colors (adjusted for dark mode)
    primaryPurple: ColorPalette.purple[300],      // #9089D4 - Lighter for visibility
    secondaryPurple: ColorPalette.blue[200],      // #ABC1FF - Blue tint
    lightPurple: ColorPalette.purple[500],        // #5F488B - Darker version
    softPink: ColorPalette.purple[700],           // #4D2FA0 - Deep purple
    lightBlue: ColorPalette.blue[200],            // #ABC1FF
    
    // Surface colors for dark mode
    surfaceBackground: ColorPalette.gray[950],    // #1F2937
    cardShadow: 'rgba(144, 137, 212, 0.15)',     // Purple shadow for dark
    accentBackground: ColorPalette.gray[800],     // #374151 - Accent
    
    // Additional semantic colors
    backgroundBlur: ColorPalette.purple[800],     // Dark blur effect
    divider: ColorPalette.gray[800],              // #374151 - Divider
    overlay: 'rgba(0, 0, 0, 0.6)',               // Darker overlay
  },
};
