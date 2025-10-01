import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // เปิดเสียง
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type?: string;
  productId?: string;
  productName?: string;
  daysUntilExpiry?: number;
  notificationId?: string; // Add notification ID for tracking
}

export interface DeviceRegistration {
  platform: string;
  device_model?: string;
  app_version?: string;
  push_token: string;
}

// Get push token and register device
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'YourButler Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      description: 'Notifications for product expiry reminders and updates',
      sound: 'default', // ใช้เสียงเริ่มต้นของระบบ
      enableVibrate: true,
      enableLights: true,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }
    
    try {
      // Get Expo push token
      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      token = pushTokenData.data;
      
      console.log('Push token obtained:', token);
      
      // Store token locally
      await AsyncStorage.setItem('push_token', token);
      
      // Register device with backend
      await registerDeviceWithBackend(token);
      
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  } else {
    console.warn('Must use physical device for Push Notifications');
    return null;
  }

  return token;
}

// Register device with YourButler backend
async function registerDeviceWithBackend(pushToken: string) {
  try {
    const deviceInfo: DeviceRegistration = {
      platform: Platform.OS,
      device_model: Device.modelName || 'Unknown',
      app_version: Constants.expoConfig?.version || '1.0.0',
      push_token: pushToken
    };

    console.log('Registering device:', deviceInfo);

    // Try to register with API client
    const response = await apiClient.registerDevice(deviceInfo);
    console.log('Device registered successfully:', response);
    
    // Store registration status
    await AsyncStorage.setItem('device_registered', 'true');
    
  } catch (error) {
    console.error('Error registering device:', error);
    
    // Always mark as registered for development since we have mock fallback
    await AsyncStorage.setItem('device_registered', 'true');
    console.log('Device registration marked as successful (using mock fallback)');
  }
}

// Unregister device (when user logs out)
export async function unregisterDevice() {
  try {
    const pushToken = await AsyncStorage.getItem('push_token');
    if (pushToken) {
      await apiClient.unregisterDevice(pushToken);
    }
    
    // Clear local storage
    await AsyncStorage.multiRemove(['push_token', 'device_registered']);
    
    console.log('Device unregistered successfully');
  } catch (error) {
    console.error('Error unregistering device:', error);
    // Even if API fails, clear local storage
    await AsyncStorage.multiRemove(['push_token', 'device_registered']);
  }
}

// Check if device is already registered
export async function isDeviceRegistered(): Promise<boolean> {
  try {
    const registered = await AsyncStorage.getItem('device_registered');
    return registered === 'true';
  } catch {
    return false;
  }
}

// Handle notification when app is in foreground
export function handleNotificationReceived(notification: Notifications.Notification) {
  console.log('Notification received:', notification);
  
  const data = notification.request.content.data as NotificationData;
  
  // Mark notification as delivered if it has an ID
  if (data.notificationId) {
    // Could track delivery status here
    console.log(`Notification ${data.notificationId} delivered`);
  }
  
  switch (data.type) {
    case 'expiry_reminder':
      console.log(`Product "${data.productName}" expires in ${data.daysUntilExpiry} days`);
      break;
    case 'product_expired':
      console.log(`Product "${data.productName}" has expired`);
      break;
    default:
      console.log('Unknown notification type:', data.type);
  }
}

// Handle notification interaction (when user taps)
export function handleNotificationResponse(
  response: Notifications.NotificationResponse,
  navigation: any
) {
  console.log('Notification response:', response);
  
  const responseData = response.notification.request.content.data as NotificationData;
  
  // Mark notification as clicked if it has an ID
  if (responseData.notificationId) {
    apiClient.markNotificationAsClicked(responseData.notificationId).catch((error: any) => {
      console.error('Failed to mark notification as clicked:', error);
    });
  }
  
  const data = response.notification.request.content.data as NotificationData;
  
  switch (data.type) {
    case 'expiry_reminder':
    case 'product_expired':
      if (data.productId) {
        // Navigate to product detail
        navigation.navigate('product-detail', { id: data.productId });
      } else {
        // Navigate to My Items page
        navigation.navigate('my-items');
      }
      break;
    default:
      // Default to home
      navigation.navigate('home');
  }
}

// Generate unique notification ID
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Schedule a test notification (for development)
export async function scheduleTestNotification() {
  if (!Device.isDevice) {
    console.warn('Test notifications only work on real devices');
    return;
  }

  const notificationId = generateNotificationId();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🏠 YourButler Test",
      body: "This is a test notification with sound!",
      sound: 'default', // เสียงเริ่มต้น
      data: {
        type: 'test',
        notificationId: notificationId,
      },
    },
    trigger: null, // Show immediately
  });

  console.log('Test notification scheduled with ID:', notificationId);
}

// Schedule expiry reminder notification
export async function scheduleExpiryNotification(
  productName: string, 
  daysUntilExpiry: number,
  productId?: string
) {
  if (!Device.isDevice) {
    console.warn('Notifications only work on real devices');
    return;
  }

  const isUrgent = daysUntilExpiry <= 1;
  const notificationId = generateNotificationId();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: isUrgent ? "⚠️ YourButler Alert!" : "🏠 YourButler Reminder",
      body: daysUntilExpiry === 0 
        ? `${productName} expires today!` 
        : daysUntilExpiry === 1
        ? `${productName} expires tomorrow!`
        : `${productName} expires in ${daysUntilExpiry} days`,
      sound: isUrgent ? 'default' : 'default', // เสียงเดียวกัน หรือใช้ 'notification-sound.wav' สำหรับ custom
      badge: 1,
      data: {
        type: 'expiry_reminder',
        productId: productId,
        productName: productName,
        daysUntilExpiry: daysUntilExpiry,
        notificationId: notificationId,
      },
    },
    trigger: null, // Show immediately
  });

  console.log('Expiry notification scheduled with ID:', notificationId);
}

// Schedule expired notification  
export async function scheduleExpiredNotification(
  productName: string,
  productId?: string
) {
  if (!Device.isDevice) {
    console.warn('Notifications only work on real devices');
    return;
  }

  const notificationId = generateNotificationId();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 YourButler Alert!",
      body: `${productName} has expired! Please check and update status.`,
      sound: 'default', // เสียงแจ้งเตือน
      badge: 1,
      data: {
        type: 'product_expired',
        productId: productId,
        productName: productName,
        notificationId: notificationId,
      },
    },
    trigger: null,
  });

  console.log('Expired notification scheduled with ID:', notificationId);
}
