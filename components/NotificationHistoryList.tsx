import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNotificationHistory } from '@/hooks/useNotificationHistory';
import { NotificationHistory } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from '@/hooks/useFonts';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { navigateGently, NavigationPresets } from '@/utils/navigation';

interface NotificationHistoryItemProps {
  item: NotificationHistory;
  onMarkAsRead: (id: string) => void;
  onMarkAsClicked: (id: string) => void;
}

function NotificationHistoryItem({ item, onMarkAsRead, onMarkAsClicked }: NotificationHistoryItemProps) {
  const textColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'subtitleText');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const { fontsLoaded, getFontFamily } = useFonts();
  const { t } = useI18n();
  const { colorScheme } = useTheme();
  
  // Brand colors
  const primaryPurple = "#5F488B";
  const successGreen = "#52c41a";
  const warningOrange = "#fa8c16";
  const errorRed = "#ff4d4f";
  const infoBlue = "#1890ff";

  const getStatusConfig = () => {
    if (item.status === 'failed') return { icon: '❌', color: errorRed, text: t('common.error') };
    if (item.is_clicked) return { icon: '✅', color: successGreen, text: 'อ่านแล้ว' };
    if (item.is_read) return { icon: '👁️', color: infoBlue, text: 'ดูแล้ว' };
    return { icon: '🔔', color: primaryPurple, text: 'ใหม่' };
  };

  const getTypeConfig = () => {
    switch (item.type) {
      case 'expiry_reminder': return { emoji: '⏰', color: warningOrange, label: t('notifications.types.expiry') };
      case 'product_expired': return { emoji: '🚨', color: errorRed, label: 'แจ้งเตือนหมดอายุ' };
      case 'test': return { emoji: '🧪', color: infoBlue, label: 'ทดสอบ' };
      default: return { emoji: '📱', color: primaryPurple, label: t('notifications.types.system') };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'เมื่อกี้นี้';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handlePress = () => {
    // Navigate to notification detail
    navigateGently(`/(app)/notification-detail?id=${item.id}`, NavigationPresets.gentle);
  };

  const statusConfig = getStatusConfig();
  const typeConfig = getTypeConfig();
  const isUnread = !item.is_read && !item.is_clicked;

  if (!fontsLoaded) return null;

  return (
    <Pressable
      style={[
        styles.notificationCard,
        { 
          backgroundColor: cardBackground,
          borderLeftColor: isUnread ? primaryPurple : 'transparent',
          opacity: isUnread ? 1 : 0.75,
          transform: [{ scale: isUnread ? 1 : 0.98 }],
        }
      ]}
      onPress={handlePress}
      android_ripple={{ 
        color: `${primaryPurple}15`,
        borderless: false 
      }}
    >
      {/* Header with type and status */}
      <View style={styles.cardHeader}>
        <View style={styles.typeSection}>
          <View style={[styles.typeIcon, { backgroundColor: `${typeConfig.color}15` }]}>
            <Text style={styles.typeEmoji}>{typeConfig.emoji}</Text>
          </View>
          <View style={styles.typeInfo}>
            <Text style={[styles.typeLabel, { 
              color: typeConfig.color, 
              fontFamily: getFontFamily('medium')
            }]}>
              {typeConfig.label}
            </Text>
            <Text style={[styles.timestamp, { 
              color: subtitleColor,
              fontFamily: getFontFamily('regular')
            }]}>
              {formatDate(item.sent_at)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}15` }]}>
          <Text style={styles.statusEmoji}>{statusConfig.icon}</Text>
        </View>
      </View>
      
      {/* Title */}
      <Text 
        style={[
          styles.title, 
          { 
            color: textColor,
            fontFamily: getFontFamily(isUnread ? 'bold' : 'medium')
          }
        ]}
        numberOfLines={2}
      >
        {item.title}
      </Text>
      
      {/* Body */}
      <Text 
        style={[styles.body, { 
          color: subtitleColor,
          fontFamily: getFontFamily('regular')
        }]}
        numberOfLines={3}
      >
        {item.body}
      </Text>
      
      {/* Product info if available */}
      {item.product_name && (
        <View style={[styles.productTag, { backgroundColor: `${primaryPurple}08` }]}>
          <Ionicons name="cube-outline" size={14} color={primaryPurple} />
          <Text style={[styles.productName, { 
            color: primaryPurple,
            fontFamily: getFontFamily('medium')
          }]}>
            {item.product_name}
          </Text>
        </View>
      )}
      
      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={[styles.deliveryStatus, { 
          color: item.status === 'delivered' ? successGreen : item.status === 'failed' ? errorRed : subtitleColor,
          fontFamily: getFontFamily('regular')
        }]}>
          {item.status === 'delivered' ? '✓ ส่งแล้ว' : 
           item.status === 'failed' ? '✗ ส่งไม่สำเร็จ' : '📤 ส่งแล้ว'}
        </Text>
        
        {isUnread && (
          <View style={[styles.unreadDot, { backgroundColor: primaryPurple }]} />
        )}
      </View>
    </Pressable>
  );
}

interface NotificationHistoryListProps {
  onNavigateToProduct?: (productId: string) => void;
}

export default function NotificationHistoryList({ onNavigateToProduct }: NotificationHistoryListProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const subtitleColor = useThemeColor({}, 'subtitleText');
  const { fontsLoaded, getFontFamily } = useFonts();
  const { t } = useI18n();
  const { colorScheme } = useTheme();

  // Brand colors
  const primaryPurple = "#5F488B";
  const lightPurple = "#F8F6FC";
  const accentPurple = "#E8E1F2";

  const {
    history,
    stats,
    unreadCount,
    loading,
    error,
    refresh,
    markAsRead,
    markAsClicked,
    markAllAsRead,
    loadMore,
    hasMore,
    isEmpty
  } = useNotificationHistory();

  // Safe unread count handling
  const safeUnreadCount = unreadCount ?? 0;

  const handleMarkAllAsRead = () => {
    if (safeUnreadCount === 0) return;
    
    Alert.alert(
      'อ่านทั้งหมด',
      `อ่านการแจ้งเตือนทั้งหมด ${safeUnreadCount} รายการใช่ไหม?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: 'อ่านทั้งหมด', 
          onPress: markAllAsRead,
          style: 'default'
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Beautiful Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, { 
          backgroundColor: colorScheme === 'dark' ? cardBackground : lightPurple 
        }]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `${primaryPurple}15` }]}>
                <Ionicons name="notifications" size={20} color={primaryPurple} />
              </View>
              <Text style={[styles.statNumber, { 
                color: primaryPurple,
                fontFamily: getFontFamily('bold')
              }]}>
                {stats?.total || 0}
              </Text>
              <Text style={[styles.statLabel, { 
                color: subtitleColor,
                fontFamily: getFontFamily('regular')
              }]}>
                ทั้งหมด
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#ff6b6b15' }]}>
                <Ionicons name="mail-unread" size={20} color="#ff6b6b" />
              </View>
              <Text style={[styles.statNumber, { 
                color: '#ff6b6b',
                fontFamily: getFontFamily('bold')
              }]}>
                {safeUnreadCount}
              </Text>
              <Text style={[styles.statLabel, { 
                color: subtitleColor,
                fontFamily: getFontFamily('regular')
              }]}>
                ยังไม่อ่าน
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#51cf6615' }]}>
                <Ionicons name="checkmark-done" size={20} color="#51cf66" />
              </View>
              <Text style={[styles.statNumber, { 
                color: '#51cf66',
                fontFamily: getFontFamily('bold')
              }]}>
                {stats?.clicked || 0}
              </Text>
              <Text style={[styles.statLabel, { 
                color: subtitleColor,
                fontFamily: getFontFamily('regular')
              }]}>
                ดำเนินการแล้ว
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#339af015' }]}>
                <Ionicons name="today" size={20} color="#339af0" />
              </View>
              <Text style={[styles.statNumber, { 
                color: '#339af0',
                fontFamily: getFontFamily('bold')
              }]}>
                {stats?.today || 0}
              </Text>
              <Text style={[styles.statLabel, { 
                color: subtitleColor,
                fontFamily: getFontFamily('regular')
              }]}>
                วันนี้
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Mark All Read Button */}
      {safeUnreadCount > 0 && (
        <Pressable
          style={[styles.markAllButton, { 
            backgroundColor: `${primaryPurple}12`,
            borderColor: primaryPurple + '40'
          }]}
          onPress={handleMarkAllAsRead}
          android_ripple={{ color: `${primaryPurple}20` }}
        >
          <View style={[styles.markAllIcon, { backgroundColor: `${primaryPurple}20` }]}>
            <Ionicons name="checkmark-done" size={18} color={primaryPurple} />
          </View>
          <Text style={[styles.markAllText, { 
            color: primaryPurple,
            fontFamily: getFontFamily('medium')
          }]}>
            อ่านทั้งหมด ({safeUnreadCount})
          </Text>
        </Pressable>
      )}

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { 
          color: textColor,
          fontFamily: getFontFamily('bold')
        }]}>
          การแจ้งเตือนล่าสุด
        </Text>
        <View style={[styles.sectionLine, { backgroundColor: accentPurple }]} />
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: NotificationHistory }) => (
    <NotificationHistoryItem
      item={item}
      onMarkAsRead={markAsRead}
      onMarkAsClicked={markAsClicked}
    />
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <Pressable
        style={[styles.loadMoreButton, { 
          borderColor: primaryPurple + '40',
          backgroundColor: `${primaryPurple}08`
        }]}
        onPress={loadMore}
        disabled={loading}
        android_ripple={{ color: `${primaryPurple}15` }}
      >
        <Ionicons 
          name={loading ? "refresh" : "chevron-down"} 
          size={18} 
          color={primaryPurple} 
          style={loading ? { transform: [{ rotate: '180deg' }] } : {}}
        />
        <Text style={[styles.loadMoreText, { 
          color: primaryPurple,
          fontFamily: getFontFamily('medium')
        }]}>
          {loading ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม'}
        </Text>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: `${primaryPurple}08` }]}>
        <Ionicons name="notifications-outline" size={48} color={primaryPurple} />
      </View>
      <Text style={[styles.emptyTitle, { 
        color: textColor,
        fontFamily: getFontFamily('bold')
      }]}>
        {t('notifications.empty')}
      </Text>
      <Text style={[styles.emptySubtext, { 
        color: subtitleColor,
        fontFamily: getFontFamily('regular')
      }]}>
        ฉันจะแจ้งให้คุณทราบเมื่อมีข้อมูลใหม่
      </Text>
    </View>
  );

  if (!fontsLoaded) return null;

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <View style={[styles.errorIcon, { backgroundColor: '#ff4d4f15' }]}>
            <Ionicons name="alert-circle-outline" size={48} color="#ff4d4f" />
          </View>
          <Text style={[styles.errorTitle, { 
            color: textColor,
            fontFamily: getFontFamily('bold')
          }]}>
            เกิดข้อผิดพลาด
          </Text>
          <Text style={[styles.errorText, { 
            color: subtitleColor,
            fontFamily: getFontFamily('regular')
          }]}>
            ไม่สามารถโหลดการแจ้งเตือนได้
          </Text>
          <Pressable
            style={[styles.retryButton, { 
              backgroundColor: `${primaryPurple}12`,
              borderColor: primaryPurple + '40'
            }]}
            onPress={refresh}
            android_ripple={{ color: `${primaryPurple}20` }}
          >
            <Ionicons name="refresh" size={18} color={primaryPurple} />
            <Text style={[styles.retryText, { 
              color: primaryPurple,
              fontFamily: getFontFamily('medium')
            }]}>
              {t('common.retry')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={isEmpty ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={primaryPurple}
            colors={[primaryPurple]}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 24,
  },
  markAllIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  markAllText: {
    fontSize: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  sectionLine: {
    height: 2,
    width: 40,
    borderRadius: 1,
  },
  separator: {
    height: 12,
  },
  notificationCard: {
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeEmoji: {
    fontSize: 18,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusEmoji: {
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  productTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 13,
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryStatus: {
    fontSize: 13,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 16,
  },
  loadMoreText: {
    marginLeft: 8,
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  errorIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 12,
  },
  retryText: {
    marginLeft: 8,
    fontSize: 15,
  },
});
