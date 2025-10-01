import {
  apiClient,
  NotificationHistory,
  NotificationHistoryResponse,
  NotificationStats,
  UnreadCountResponse,
} from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

export function useNotificationHistory() {
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });

  // Fetch notification history with pagination
  const fetchHistory = useCallback(
    async (page: number = 1, limit: number = 20) => {
      try {
        setLoading(true);
        setError(null);

        const response: NotificationHistoryResponse =
          await apiClient.getNotificationHistory(page, limit);

        if (page === 1) {
          setHistory(response.data);
        } else {
          // Append for pagination
          setHistory((prev) => [...prev, ...response.data]);
        }

        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          total_pages: response.total_pages,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch notification history"
        );
        console.error("Error fetching notification history:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch notification stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await apiClient.getNotificationStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching notification stats:", err);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const countData: UnreadCountResponse =
        await apiClient.getUnreadNotificationCount();
      setUnreadCount(countData.unread_count || 0); // Ensure we always have a number
    } catch (err) {
      console.error("Error fetching unread count:", err);
      setUnreadCount(0); // Set to 0 if there's an error
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await apiClient.markNotificationAsRead(notificationId);

        // Update local state
        setHistory((prev) =>
          prev.map((item) =>
            item.id === notificationId
              ? { ...item, is_read: true, read_at: new Date().toISOString() }
              : item
          )
        );

        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Refresh stats
        await fetchStats();
      } catch (err) {
        console.error("Error marking notification as read:", err);
        throw err;
      }
    },
    [fetchStats]
  );

  // Mark notification as clicked
  const markAsClicked = useCallback(
    async (notificationId: string) => {
      try {
        await apiClient.markNotificationAsClicked(notificationId);

        // Update local state (clicked also marks as read)
        setHistory((prev) =>
          prev.map((item) =>
            item.id === notificationId
              ? {
                  ...item,
                  is_clicked: true,
                  is_read: true,
                  clicked_at: new Date().toISOString(),
                  read_at: item.read_at || new Date().toISOString(),
                }
              : item
          )
        );

        // Update unread count if it wasn't read before
        const notification = history.find((item) => item.id === notificationId);
        if (notification && !notification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        // Refresh stats
        await fetchStats();
      } catch (err) {
        console.error("Error marking notification as clicked:", err);
        throw err;
      }
    },
    [history, fetchStats]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.markAllNotificationsAsRead();

      // Update local state
      setHistory((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
          read_at: item.read_at || new Date().toISOString(),
        }))
      );

      // Reset unread count
      setUnreadCount(0);

      // Refresh stats
      await fetchStats();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  }, [fetchStats]);

  // Load more notifications (pagination)
  const loadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages && !loading) {
      fetchHistory(pagination.page + 1, pagination.limit);
    }
  }, [pagination.page, pagination.total_pages, loading, fetchHistory]);

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([fetchHistory(1), fetchStats(), fetchUnreadCount()]);
  }, [fetchHistory, fetchStats, fetchUnreadCount]);

  // Initial load
  useEffect(() => {
    // Wrap in try-catch to prevent crashes
    const loadInitialData = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error("Error loading initial notification data:", err);
        // Set safe defaults
        setUnreadCount(0);
        setHistory([]);
        setStats(null);
        setError("Failed to load notifications");
      }
    };

    loadInitialData();
  }, []);

  return {
    // Data
    history,
    stats,
    unreadCount,
    pagination,

    // State
    loading,
    error,

    // Actions
    fetchHistory,
    markAsRead,
    markAsClicked,
    markAllAsRead,
    loadMore,
    refresh,

    // Computed
    hasMore: pagination.page < pagination.total_pages,
    isEmpty: history.length === 0 && !loading,
  };
}
