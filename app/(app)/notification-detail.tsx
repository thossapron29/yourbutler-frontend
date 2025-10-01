import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@/contexts/ThemeContext';
import { useFonts } from '@/hooks/useFonts';
import { useI18n } from '@/contexts/I18nContext';
import { NotificationHistory, apiClient } from '@/utils/api';
import { navigateBackGently, NavigationPresets } from '@/utils/navigation';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const { colorScheme } = useTheme();
  const { fontsLoaded, getFontFamily } = useFonts();
  
  const [notification, setNotification] = useState<NotificationHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'subtitleText');
  const borderColor = useThemeColor({}, 'borderColor');
  
  // Brand colors
  const primaryPurple = "#5F488B";
  const successGreen = "#52c41a";
  const warningOrange = "#fa8c16";
  const errorRed = "#ff4d4f";
  const infoBlue = "#1890ff";

  useEffect(() => {
    if (!id) {
      setError('Invalid notification ID');
      setLoading(false);
      return;
    }
    
    fetchNotificationDetail();
  }, [id]);

  const fetchNotificationDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getNotificationDetail(id);
      setNotification(response.notification);
      
      // Mark as read if not already read
      if (!response.notification.is_read) {
        await apiClient.markNotificationAsRead(id);
        setNotification(prev => prev ? {
          ...prev,
          is_read: true,
          read_at: new Date().toISOString()
        } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notification');
    } finally {
      setLoading(false);
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'expiry_reminder': return '⏰';
      case 'product_expired': return '🚨';
      case 'test': return '🧪';
      default: return '📱';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('common.locale'), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewProduct = () => {
    if (notification?.product_name) {
      Alert.alert(
        t('notifications.actions.viewProduct'),
        t('notifications.actions.viewProductMessage', { productName: notification.product_name }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('notifications.actions.viewProductButton'), 
            onPress: () => {
              // Navigate to My Items for now
              router.push('/(app)/my-items');
            }
          }
        ]
      );
    }
  };

  const handleAddToShoppingList = () => {
    if (notification?.product_name) {
      Alert.alert(
        t('notifications.actions.addToShoppingList'),
        t('notifications.actions.addToShoppingListMessage', { productName: notification.product_name }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { 
            text: t('notifications.actions.addToShoppingListButton'), 
            onPress: () => {
              router.push('/(app)/shopping-list');
            }
          }
        ]
      );
    }
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { 
            color: textColor,
            fontFamily: getFontFamily('regular')
          }]}>
            {t('notifications.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !notification) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { 
            color: textColor,
            fontFamily: getFontFamily('regular')
          }]}>
            {error || t('notifications.notFound')}
          </Text>
          <Pressable
            style={[styles.backButton, { backgroundColor: `${primaryPurple}15` }]}
            onPress={() => {
              navigateBackGently(NavigationPresets.gentle);
            }}
          >
            <Text style={[styles.backButtonText, { 
              color: primaryPurple,
              fontFamily: getFontFamily('medium')
            }]}>
              {t('common.goBack')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: backgroundColor,
        borderBottomColor: borderColor
      }]}>
        <Pressable 
          style={[styles.headerBackButton, { 
            backgroundColor: `${primaryPurple}15`
          }]}
          onPress={() => {
            navigateBackGently(NavigationPresets.gentle);
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={22} color={primaryPurple} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { 
          color: textColor,
          fontFamily: getFontFamily('bold')
        }]}>
          {getTypeEmoji(notification.type)} {notification.title}
        </Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Alfred Avatar and Info */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarContainer, { backgroundColor: `${primaryPurple}15` }]}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
          <Text style={[styles.alfredName, { 
            color: textColor,
            fontFamily: getFontFamily('bold')
          }]}>
            Alfred
          </Text>
        </View>

        {/* Message Content */}
        <Text style={[styles.messageText, { 
          color: textColor,
          fontFamily: getFontFamily('regular')
        }]}>
          {notification.body}
        </Text>

        {/* Product Action Buttons */}
        {notification.product_name && (
          <View style={styles.actionButtonsContainer}>
            <Pressable
              style={[styles.actionButton, styles.primaryButton, { 
                backgroundColor: primaryPurple
              }]}
              onPress={handleViewProduct}
            >
              <Text style={[styles.actionButtonText, { 
                color: 'white',
                fontFamily: getFontFamily('medium')
              }]}>
                {t('notifications.actions.viewThisProduct')}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.secondaryButton, { 
                backgroundColor: successGreen
              }]}
              onPress={handleAddToShoppingList}
            >
              <Ionicons name="arrow-forward" size={16} color="white" style={styles.buttonIcon} />
              <Text style={[styles.actionButtonText, { 
                color: 'white',
                fontFamily: getFontFamily('medium')
              }]}>
                {t('notifications.actions.addToShoppingListShort')}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadataContainer}>
          <Text style={[styles.metadataText, { 
            color: subtitleColor,
            fontFamily: getFontFamily('regular')
          }]}>
            {t('notifications.metadata.sentAt')}: {formatDate(notification.sent_at)}
          </Text>
          
          {notification.read_at && (
            <Text style={[styles.metadataText, { 
              color: subtitleColor,
              fontFamily: getFontFamily('regular')
            }]}>
              {t('notifications.metadata.readAt')}: {formatDate(notification.read_at)}
            </Text>
          )}

          <Text style={[styles.metadataText, { 
            color: subtitleColor,
            fontFamily: getFontFamily('regular')
          }]}>
            {t('notifications.metadata.status')}: {notification.status === 'delivered' ? t('notifications.status.delivered') : 
                    notification.status === 'failed' ? t('notifications.status.failed') : t('notifications.status.sent')}
          </Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
  },
  alfredName: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButtonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    // Primary action button styles
  },
  secondaryButton: {
    // Secondary action button styles
  },
  buttonIcon: {
    marginRight: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  metadataContainer: {
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E7',
  },
  metadataText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
});
