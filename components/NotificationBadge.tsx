import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotificationHistory } from '@/hooks/useNotificationHistory';
import { useThemeColor } from '@/hooks/useThemeColor';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
  fallbackCount?: number; // Allow manual override
}

const NotificationBadge = React.memo(({ 
  size = 'medium', 
  showZero = false,
  fallbackCount 
}: NotificationBadgeProps) => {
  const { unreadCount, error, loading } = useNotificationHistory();
  const tintColor = useThemeColor({}, 'tint');

  // Use fallbackCount if provided, otherwise use hook value with safe defaults
  const safeUnreadCount = fallbackCount !== undefined 
    ? fallbackCount 
    : (error || unreadCount === undefined || loading) 
      ? 0 
      : unreadCount;

  if (!showZero && safeUnreadCount === 0) {
    return null;
  }

  const sizeStyles = {
    small: {
      container: styles.smallContainer,
      text: styles.smallText,
    },
    medium: {
      container: styles.mediumContainer,
      text: styles.mediumText,
    },
    large: {
      container: styles.largeContainer,
      text: styles.largeText,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View 
      style={[
        styles.badge,
        currentSize.container,
        { backgroundColor: safeUnreadCount > 0 ? '#ff4757' : '#ccc' }
      ]}
    >
      <Text style={[styles.badgeText, currentSize.text]}>
        {safeUnreadCount > 99 ? '99+' : safeUnreadCount.toString()}
      </Text>
    </View>
  );
});

export default NotificationBadge;

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallContainer: {
    height: 16,
    minWidth: 16,
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  smallText: {
    fontSize: 10,
  },
  mediumContainer: {
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  mediumText: {
    fontSize: 12,
  },
  largeContainer: {
    height: 24,
    minWidth: 24,
    borderRadius: 12,
    paddingHorizontal: 6,
  },
  largeText: {
    fontSize: 14,
  },
});
