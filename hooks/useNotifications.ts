import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { 
  registerForPushNotificationsAsync,
  handleNotificationReceived,
  handleNotificationResponse,
  isDeviceRegistered 
} from '../utils/notifications';

export function useNotifications() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Register for push notifications if not already registered
    const setupNotifications = async () => {
      const isRegistered = await isDeviceRegistered();
      if (!isRegistered) {
        await registerForPushNotificationsAsync();
      }
    };

    setupNotifications();

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      handleNotificationReceived(notification);
    });

    // Listen for notification interactions
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response, router);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);

  return {
    // You can return any utility functions here if needed
  };
}
