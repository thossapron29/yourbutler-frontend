import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface NotificationBadgeProps {
  count: number;
  type?: 'critical' | 'important' | 'normal';
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
}

export function NotificationBadge({ 
  count, 
  type = 'normal', 
  size = 'medium',
  showZero = false 
}: NotificationBadgeProps) {
  const textColor = useThemeColor({}, 'background'); // White text on colored background
  
  if (count === 0 && !showZero) return null;
  
  const getBadgeColor = () => {
    switch (type) {
      case 'critical': return '#FF3B30'; // Red
      case 'important': return '#FF9500'; // Orange
      default: return '#007AFF'; // Blue
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'small': return { width: 16, height: 16, minWidth: 16 };
      case 'large': return { width: 24, height: 24, minWidth: 24 };
      default: return { width: 20, height: 20, minWidth: 20 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 10;
      case 'large': return 14;
      default: return 12;
    }
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View 
      style={[
        styles.badge, 
        getBadgeSize(),
        { backgroundColor: getBadgeColor() }
      ]}
    >
      <Text 
        style={[
          styles.badgeText, 
          { color: textColor, fontSize: getTextSize() }
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
