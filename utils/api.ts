import { Platform } from "react-native";

// Use different base URL for different platforms
const getBaseUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:8080";
  }
  // For iOS simulator and Android emulator, use local IP instead of localhost
  return "http://192.168.1.73:8080";
};

const BASE_URL = getBaseUrl();

export interface ApiError {
  error: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  butler_name?: string;
  onboarding_step?: number;
  notifications_opt_in?: boolean;
}

export interface DevLoginRequest {
  email: string;
  name?: string;
}

export interface DevLoginResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface Category {
  ID: string;
  Name: string;
  Code: string;
  SortOrder: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Preset {
  ID: string;
  Name: string;
  CategoryID: string;
  Icon?: string;
  DefaultShelfDays?: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  preset?: {
    id: string;
    name: string;
  };
  notes?: string;
  quantity?: number;
  unit?: string;
  purchased_at?: string;
  expected_expiry?: string;
  remind_before?: number;
  status: string;
  next_reminder_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  category_id: string;
  preset_id?: string;
  name: string;
  notes?: string;
  quantity?: number;
  unit?: string;
  purchased_at?: string;
  expected_expiry?: string;
  remind_before_days?: number;
}

export interface CreateProductResponse {
  id: string;
  name: string;
  category_id: string;
  preset_id?: string;
  expected_expiry?: string;
  remind_before: number;
  next_reminder_at?: string;
  status: string;
}

// Notification History Types
export interface NotificationHistory {
  id: string;
  user_id: string;
  notification_id?: string;
  title: string;
  body: string;
  type: string;
  data?: any;
  status: "sent" | "delivered" | "failed";
  is_read: boolean;
  is_clicked: boolean;
  sent_at: string;
  read_at?: string;
  clicked_at?: string;
  product_id?: string;
  product_name?: string;
}

export interface NotificationHistoryResponse {
  data: NotificationHistory[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  clicked: number;
  today: number;
  this_week: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

// Smart Notifications Types (ตรงกับ Backend)
export interface SmartNotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  priority: "high" | "medium" | "low";
  product_id?: string;
  product_name?: string;
  category_name?: string;
  data: Record<string, any>;
  sent_at: string;
  read_at?: string;
}

export interface UnreadCountByCategory {
  category_id: string;
  category_name: string;
  unread_count: number;
}

export interface SmartNotificationsResponse {
  recent_with_priority: SmartNotificationItem[];
  unread_by_category: UnreadCountByCategory[];
  total_unread: number;
}

// User Preferences Types
export interface UserPreferences {
  id: string;
  user_id: string;
  // Global preferences
  butler_personality: "formal" | "friendly" | "casual" | "enthusiastic";
  reminder_frequency: "minimal" | "normal" | "frequent";
  smart_suggestions_enabled: boolean;
  auto_shopping_list: boolean;
  // Category preferences
  favorite_categories: string[];
  category_reminder_days: Record<string, number>;
  // Notification preferences
  notification_times: string[]; // ['09:00', '18:00']
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  weekend_notifications: boolean;
  // Shopping preferences
  preferred_stores: string[];
  budget_alerts: boolean;
  bulk_buy_suggestions: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdatePreferencesRequest {
  butler_personality?: "formal" | "friendly" | "casual" | "enthusiastic";
  reminder_frequency?: "minimal" | "normal" | "frequent";
  smart_suggestions_enabled?: boolean;
  auto_shopping_list?: boolean;
  favorite_categories?: string[];
  notification_times?: string[];
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  weekend_notifications?: boolean;
  preferred_stores?: string[];
  budget_alerts?: boolean;
  bulk_buy_suggestions?: boolean;
}

// Butler Recommendations Types
export interface ButlerRecommendation {
  id: string;
  type: "category_suggestion" | "bulk_buy" | "usage_pattern" | "seasonal";
  title: string;
  description: string;
  confidence_score: number; // 0-100
  estimated_savings?: number;
  action_items: string[];
  related_products?: string[];
  expires_at?: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

// Dashboard API Types
export interface DashboardSummary {
  active_count: number;
  expiring_soon_count: number;
  expired_count: number;
  consumed_count: number;
  expiry_breakdown: {
    expiring_in_1_day: number;
    expiring_in_3_days: number;
    expiring_in_7_days: number;
  };
  trend_data: {
    items_added_this_week: number;
    items_added_last_week: number;
    items_consumed_this_week: number;
    items_consumed_last_week: number;
    added_trend_percent: number;
    consumed_trend_percent: number;
  };
}

export interface ExpiringProduct {
  id: string;
  name: string;
  category_name: string;
  expected_expiry: string | null;
  remind_before: number;
  status: string;
}

export interface ExpiringProductsResponse {
  items: ExpiringProduct[];
  next_cursor?: string;
  has_more?: boolean;
}

class ApiClient {
  private accessToken?: string;
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
    console.log(`API base URL updated to: ${this.baseUrl}`);
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`API Request: ${options.method || "GET"} ${url}`);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add existing headers
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    if (this.accessToken && !endpoint.includes("/auth/")) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      console.log("Request headers:", headers);
      if (options.body) {
        console.log("Request body:", options.body);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`Response status: ${response.status}`);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!response.ok) {
        const errorData = isJson
          ? await response.json()
          : { error: `HTTP ${response.status}` };
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = isJson ? await response.json() : {};
      console.log("Response data:", data);

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request("/health");
  }

  async devLogin(data: DevLoginRequest): Promise<DevLoginResponse> {
    return this.request("/auth/dev-login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refreshToken(data: RefreshRequest): Promise<RefreshResponse> {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Catalog APIs (no auth required)
  async getCategories(): Promise<{ data: Category[] }> {
    return this.request("/catalog/categories");
  }

  async getPresets(categoryId?: string): Promise<{ data: Preset[] }> {
    if (categoryId) {
      return this.request(`/catalog/categories/${categoryId}/presets`);
    }
    return this.request("/catalog/presets");
  }

  // User APIs (auth required)
  async getCurrentUser(): Promise<User> {
    return this.request("/api/me");
  }

  async updateUserProfile(data: {
    display_name?: string;
    butler_name?: string;
  }): Promise<User> {
    return this.request("/api/me/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async completeOnboarding(): Promise<void> {
    return this.request("/api/me/onboarding/complete", {
      method: "POST",
    });
  }

  // Product APIs (auth required)
  async getProducts(
    status?: "active" | "consumed" | "expired" | "archived"
  ): Promise<{ data: ProductItem[] }> {
    const params = status ? `?status=${status}` : "";
    return this.request(`/api/products${params}`);
  }

  async getProductById(id: string): Promise<ProductItem> {
    return this.request(`/api/products/${id}`);
  }

  async updateProduct(
    id: string,
    data: Partial<ProductItem>
  ): Promise<ProductItem> {
    return this.request(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request(`/api/products/${id}`, {
      method: "DELETE",
    });
  }

  async createProduct(
    data: CreateProductRequest
  ): Promise<CreateProductResponse> {
    return this.request("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async markAsPurchased(
    id: string,
    data: {
      purchased_at?: string;
      expected_expiry?: string;
      quantity?: number;
      notes?: string;
      create_new: boolean;
    }
  ): Promise<{
    marked_item: { id: string; status: string };
    new_item?: { id: string; name: string; expected_expiry: string };
  }> {
    return this.request(`/api/products/${id}/mark-purchased`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Device registration for push notifications
  async registerDevice(data: any): Promise<any> {
    return this.request("/devices/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async unregisterDevice(pushToken: string): Promise<void> {
    return this.request("/devices/unregister", {
      method: "POST",
      body: JSON.stringify({ push_token: pushToken }),
    });
  }

  // Notification History APIs
  async getNotificationHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<NotificationHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(`/api/notifications/history?${params}`);
  }

  async getNotificationDetail(notificationId: string): Promise<{ notification: NotificationHistory }> {
    return this.request(`/api/notifications/${notificationId}`);
  }

  async getUnreadNotificationCount(): Promise<UnreadCountResponse> {
    return this.request("/api/notifications/unread-count");
  }

  async getNotificationStats(): Promise<NotificationStats> {
    return this.request("/api/notifications/stats");
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    return this.request(`/api/notifications/${notificationId}/read`, {
      method: "POST",
    });
  }

  async markNotificationAsClicked(notificationId: string): Promise<void> {
    return this.request(`/api/notifications/${notificationId}/click`, {
      method: "POST",
    });
  }

  async markAllNotificationsAsRead(): Promise<void> {
    return this.request("/api/notifications/mark-all-read", {
      method: "POST",
    });
  }

  // Smart Notifications APIs
  async getSmartNotifications(): Promise<SmartNotificationsResponse> {
    return this.request("/api/notifications/smart");
  }

  // User Preferences APIs
  async getUserPreferences(): Promise<UserPreferences> {
    return this.request("/api/preferences");
  }

  async updateUserPreferences(
    preferences: UpdatePreferencesRequest
  ): Promise<UserPreferences> {
    return this.request("/api/preferences/global", {
      method: "PATCH",
      body: JSON.stringify(preferences),
    });
  }

  async getFavoriteCategories(): Promise<{ categories: string[] }> {
    return this.request("/api/preferences/favorites");
  }

  async setFavoriteCategories(categories: string[]): Promise<void> {
    return this.request("/api/preferences/favorites", {
      method: "PUT",
      body: JSON.stringify({ categories }),
    });
  }

  // Butler Recommendations APIs
  async getButlerRecommendations(): Promise<{
    recommendations: ButlerRecommendation[];
  }> {
    return this.request("/api/butler/recommendations");
  }

  async dismissRecommendation(recommendationId: string): Promise<void> {
    return this.request(
      `/api/butler/recommendations/${recommendationId}/dismiss`,
      {
        method: "POST",
      }
    );
  }

  // Dashboard APIs (auth required)
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request("/api/dashboard/summary");
  }

  async getExpiringProducts(
    page: number = 1,
    limit: number = 20,
    days?: number
  ): Promise<ExpiringProductsResponse> {
    const params = new URLSearchParams();
    if (days !== undefined) params.append("within_days", days.toString());
    if (limit !== undefined) params.append("limit", String(limit));
    return this.request(`/api/dashboard/expiring?${params}`);
  }

  // Settings APIs
  async getSettings(): Promise<{
    profile: { name: string; email: string; timezone: string };
    preferences: {
      global: {
        enable_notifications: boolean;
        butler_personality?: string;
        default_remind_days: number;
      };
      categories: any[];
    };
    butler: {
      personality: string;
      greeting_style: string;
      recommendation_frequency: string;
    };
  }> {
    return this.request("/api/settings");
  }

  async updateButlerSettings(settings: {
    personality?: string;
    greeting_style?: string;
    recommendation_frequency?: string;
  }): Promise<{
    butler: {
      personality: string;
      greeting_style: string;
      recommendation_frequency: string;
    };
  }> {
    return this.request("/api/settings/butler", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  }

  async updateProfileSettings(profile: {
    name?: string;
    timezone?: string;
  }): Promise<{
    profile: { name: string; email: string; timezone: string };
  }> {
    return this.request("/api/settings/profile", {
      method: "PATCH",
      body: JSON.stringify(profile),
    });
  }

  // Notification Settings APIs
  async getNotificationSettings(): Promise<{
    global: {
      enable_notifications: boolean;
      default_remind_days: number;
      quiet_hours: {
        enabled: boolean;
        start: string;
        end: string;
      };
    };
    categories: {
      [key: string]: {
        enabled: boolean;
        remind_days: number;
        priority: "low" | "medium" | "high";
      };
    };
  }> {
    return this.request("/api/settings/notifications");
  }

  async updateNotificationSettings(settings: {
    global?: {
      enable_notifications?: boolean;
      default_remind_days?: number;
      quiet_hours?: {
        enabled: boolean;
        start: string;
        end: string;
      };
    };
    categories?: {
      [key: string]: {
        enabled?: boolean;
        remind_days?: number;
        priority?: "low" | "medium" | "high";
      };
    };
  }): Promise<void> {
    return this.request("/api/settings/notifications", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  }
}

export const apiClient = new ApiClient();
