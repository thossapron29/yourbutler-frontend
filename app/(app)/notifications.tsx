import React from 'react';
import { View, StyleSheet, Pressable, Text, SafeAreaView, Animated, FlatList, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@/contexts/ThemeContext';
import { useFonts } from '@/hooks/useFonts';
import { useI18n } from '@/contexts/I18nContext';
import { usePageTransition, TransitionPresets } from '@/hooks/usePageTransition';
import { navigateBackGently, navigateGently, NavigationPresets } from '@/utils/navigation';
import { useNotificationHistory } from '@/hooks/useNotificationHistory';
import { NotificationHistory } from '@/utils/api';
import { StatusBar } from 'expo-status-bar';

// Single notification item component
function NotificationItem({ item, onPress }: { 
  item: NotificationHistory; 
  onPress: () => void;
}) {
  const textColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'subtitleText');
  const { fontsLoaded, getFontFamily } = useFonts();
  
  // Brand colors
  const primaryPurple = "#5F488B";
  
  const getTypeEmoji = () => {
    switch (item.type) {
      case 'expiry_reminder': return '⏰';
      case 'product_expired': return '🚨';
      case 'test': return '🧪';
      default: return '📱';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (!fontsLoaded) return null;

  return (
    <Pressable
      style={[
        styles.notificationItem,
        { 
          opacity: item.is_read ? 0.7 : 1,
        }
      ]}
      onPress={onPress}
      android_ripple={{ color: `${primaryPurple}15` }}
    >
      <View style={styles.itemContent}>
        <View style={[styles.avatarContainer, { backgroundColor: `${primaryPurple}15` }]}>
          <Text style={styles.avatar}>{getTypeEmoji()}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.itemTitle, 
              { 
                color: textColor,
                fontFamily: getFontFamily(item.is_read ? 'medium' : 'bold')
              }
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text 
            style={[
              styles.itemDescription, 
              { 
                color: subtitleColor,
                fontFamily: getFontFamily('regular')
              }
            ]}
            numberOfLines={2}
          >
            {item.body}
          </Text>
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { 
            color: subtitleColor,
            fontFamily: getFontFamily('regular')
          }]}>
            {formatTime(item.sent_at)}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={subtitleColor} />
        </View>
      </View>
      
      {!item.is_read && (
        <View style={[styles.unreadDot, { backgroundColor: primaryPurple }]} />
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colorScheme } = useTheme();
  const { fontsLoaded, getFontFamily } = useFonts();
  const { history, loading, refresh, loadMore } = useNotificationHistory();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'subtitleText');
  const borderColor = useThemeColor({}, 'borderColor');
  const primaryPurple = "#5F488B";

  // Use gentle page transition
  const { animatedStyle } = usePageTransition(TransitionPresets.gentle);

  // Group notifications by date
  const groupedNotifications = React.useMemo(() => {
    const groups: { [key: string]: NotificationHistory[] } = {};
    
    history.forEach(notification => {
      const date = new Date(notification.sent_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = t('notifications.dates.today');
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = t('notifications.dates.yesterday');
      } else {
        key = date.toLocaleDateString(t('common.locale'), { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(notification);
    });
    
    return Object.entries(groups).map(([date, notifications]) => ({
      date,
      notifications
    }));
  }, [history]);

  const handleNotificationPress = (notification: NotificationHistory) => {
    router.push(`/(app)/notification-detail?id=${notification.id}`);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        style={colorScheme === "dark" ? "light" : "dark"} 
        backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
        translucent={false}
      />
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {/* Simple Header */}
        <View style={[styles.header, { 
          backgroundColor: backgroundColor,
          borderBottomColor: borderColor
        }]}>
          <Pressable 
            style={[styles.backButton, { 
              backgroundColor: colorScheme === 'dark' ? `${primaryPurple}20` : `${primaryPurple}15`
            }]}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(app)/home');
              }
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color={primaryPurple} />
          </Pressable>
          
          <Text style={[styles.headerTitle, { 
            color: textColor,
            fontFamily: getFontFamily('bold')
          }]}>
            {t('notifications.title')}
          </Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Notification List */}
        <FlatList
          data={groupedNotifications}
          keyExtractor={(item) => item.date}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={primaryPurple}
              colors={[primaryPurple]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.sectionContainer}>
              {/* Date Header */}
              <Text style={[styles.sectionHeader, { 
                color: subtitleColor,
                fontFamily: getFontFamily('medium')
              }]}>
                {item.date}
              </Text>
              
              {/* Notifications for this date */}
              {item.notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  item={notification}
                  onPress={() => handleNotificationPress(notification)}
                />
              ))}
            </View>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    position: 'relative',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginRight: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    left: 32,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
