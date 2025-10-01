import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  apiClient, 
  SmartNotificationsResponse, 
  UserPreferences, 
  ButlerRecommendation,
  DashboardSummary 
} from '../utils/api';

export interface ButlerPersonality {
  formal: {
    greetings: string[];
    responses: string[];
    suggestions: string[];
  };
  friendly: {
    greetings: string[];
    responses: string[];
    suggestions: string[];
  };
  casual: {
    greetings: string[];
    responses: string[];
    suggestions: string[];
  };
  enthusiastic: {
    greetings: string[];
    responses: string[];
    suggestions: string[];
  };
}

const BUTLER_PERSONALITIES: ButlerPersonality = {
  formal: {
    greetings: [
      "Good morning, {name}. I have prepared your household status report.",
      "Good afternoon, {name}. Allow me to present today's inventory overview.",
      "Good evening, {name}. I have conducted a thorough review of your supplies."
    ],
    responses: [
      "I have identified {count} items requiring your attention.",
      "Your household inventory appears to be well-maintained.",
      "I recommend prioritizing the following items for replenishment."
    ],
    suggestions: [
      "Might I suggest adding {item} to your shopping list?",
      "Based on your consumption patterns, you may wish to consider restocking {category} items.",
      "I have prepared an optimized shopping list for your convenience."
    ]
  },
  friendly: {
    greetings: [
      "Hello {name}! Let me catch you up on what's happening at home.",
      "Hi there! I've been keeping an eye on your items today.",
      "Hey {name}! Ready for your daily home update?"
    ],
    responses: [
      "I noticed {count} items that might need your attention soon.",
      "Everything's looking good! Your home is well-stocked.",
      "I've got a few suggestions to help keep things running smoothly."
    ],
    suggestions: [
      "How about adding {item} to your list? It's been a while since you restocked.",
      "Your {category} items are running low - shall I add them to your shopping list?",
      "I've created a shopping list based on what you usually need around this time."
    ]
  },
  casual: {
    greetings: [
      "Hey {name}! Here's what's up with your stuff.",
      "What's up! I've been tracking your items as usual.",
      "Hey! Time for your home inventory check-in."
    ],
    responses: [
      "Got {count} things you might want to check out.",
      "All good here! Your place is well-stocked.",
      "I've got some ideas to keep your home running smooth."
    ],
    suggestions: [
      "You're probably gonna need more {item} soon.",
      "Your {category} stuff is getting low - want me to add it to the list?",
      "Made you a shopping list with the usual suspects."
    ]
  },
  enthusiastic: {
    greetings: [
      "Great to see you, {name}! I'm excited to share today's home update!",
      "Welcome back! I've got some fantastic insights about your household!",
      "Hello superstar! Ready to optimize your home inventory together?"
    ],
    responses: [
      "Amazing! I found {count} opportunities to keep your home perfectly stocked!",
      "Fantastic news! Your home inventory is absolutely brilliant!",
      "I'm thrilled to share some wonderful suggestions for your home!"
    ],
    suggestions: [
      "I'm so excited to recommend {item} for your shopping list!",
      "Your {category} items are ready for a refresh - this is going to be great!",
      "I've crafted an incredible shopping list just for you!"
    ]
  }
};

export function useButlerExperience() {
  const { user } = useAuth();
  const [smartNotifications, setSmartNotifications] = useState<SmartNotificationsResponse | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<ButlerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load butler data
  const loadButlerData = useCallback(async () => {
    if (!user) return;
    
    try {
      setError(null);
      
      // Load available APIs (with graceful fallbacks)
      const [notificationsRes, preferencesRes] = await Promise.allSettled([
        apiClient.getSmartNotifications(),
        // Temporarily commented out until backend implements user preferences
        // apiClient.getUserPreferences(),
        Promise.resolve({
          id: 'temp',
          user_id: user.id,
          butler_personality: 'friendly' as const,
          reminder_frequency: 'normal' as const,
          smart_suggestions_enabled: true,
          auto_shopping_list: true,
          favorite_categories: ['Fresh', 'Pantry'],
          category_reminder_days: {},
          notification_times: ['09:00', '18:00'],
          weekend_notifications: true,
          preferred_stores: [],
          budget_alerts: false,
          bulk_buy_suggestions: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserPreferences),
      ]);

      if (notificationsRes.status === 'fulfilled') {
        setSmartNotifications(notificationsRes.value);
      }
      
      if (preferencesRes.status === 'fulfilled') {
        setUserPreferences(preferencesRes.value);
      }
      
      // Mock recommendations for demo (remove when API is ready)
      if (notificationsRes.status === 'fulfilled') {
        setRecommendations([
          {
            id: 'demo-1',
            type: 'category_suggestion',
            title: 'Stock up on Fresh Items',
            description: 'Based on your consumption patterns, you might run out of fresh produce soon.',
            confidence_score: 85,
            estimated_savings: 12.50,
            action_items: [
              'Add fruits to your shopping list',
              'Consider buying vegetables in bulk',
              'Check expiry dates for better planning'
            ],
            related_products: [],
          },
          {
            id: 'demo-2', 
            type: 'bulk_buy',
            title: 'Bulk Buy Opportunity',
            description: 'You could save money by buying pantry items in larger quantities.',
            confidence_score: 78,
            estimated_savings: 25.00,
            action_items: [
              'Compare bulk vs individual prices',
              'Check storage space availability',
              'Look for sales on frequently used items'
            ],
            related_products: [],
          }
        ]);
      }
      
    } catch (err) {
      console.error('Failed to load butler data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load butler data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadButlerData();
  }, [loadButlerData]);

  // Get personalized greeting based on user preferences and time
  const getPersonalizedGreeting = useCallback((dashboardSummary?: DashboardSummary) => {
    const hour = new Date().getHours();
    const userName = user?.display_name || "User";
    const butlerName = user?.butler_name || "Alfred";
    const personality = userPreferences?.butler_personality || 'friendly';
    
    const timeOfDay = hour >= 5 && hour < 12 ? 'morning' : 
                     hour >= 12 && hour < 17 ? 'afternoon' : 'evening';
    
    const greetings = BUTLER_PERSONALITIES[personality].greetings;
    const responses = BUTLER_PERSONALITIES[personality].responses;
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
      .replace('{name}', userName);
    
    let statusMessage = responses[1]; // Default to "well-maintained"
    
    if (dashboardSummary) {
      if (dashboardSummary.expiring_soon_count > 0) {
        statusMessage = responses[0].replace('{count}', dashboardSummary.expiring_soon_count.toString());
      } else if (dashboardSummary.active_count > 0) {
        statusMessage = responses[1];
      }
    }

    const emoji = timeOfDay === 'morning' ? '🌅' : 
                  timeOfDay === 'afternoon' ? '☀️' : '🌆';
    
    return {
      greeting: randomGreeting,
      message: statusMessage,
      butlerName,
      emoji,
      personality
    };
  }, [user, userPreferences]);

  // Get smart suggestions based on data
  const getSmartSuggestions = useCallback((expiringCount: number, category?: string) => {
    if (!userPreferences) return [];
    
    const personality = userPreferences.butler_personality || 'friendly';
    const suggestions = BUTLER_PERSONALITIES[personality].suggestions;
    
    const smartSuggestions = [];
    
    if (expiringCount > 0) {
      smartSuggestions.push(
        suggestions[2] // Auto-generated shopping list
      );
    }
    
    if (category) {
      smartSuggestions.push(
        suggestions[1].replace('{category}', category)
      );
    }
    
    // Add recommendations
    recommendations.slice(0, 2).forEach(rec => {
      if (rec.confidence_score > 70) {
        smartSuggestions.push(rec.description);
      }
    });
    
    return smartSuggestions;
  }, [userPreferences, recommendations]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      const updated = await apiClient.updateUserPreferences(updates);
      setUserPreferences(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    }
  }, []);

  // Dismiss recommendation
  const dismissRecommendation = useCallback(async (recommendationId: string) => {
    try {
      await apiClient.dismissRecommendation(recommendationId);
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
    } catch (err) {
      console.error('Failed to dismiss recommendation:', err);
    }
  }, []);

  // Get notification priority color
  const getNotificationPriorityColor = useCallback((type: string) => {
    switch (type) {
      case 'critical': return '#FF3B30'; // Red
      case 'important': return '#FF9500'; // Orange  
      case 'reminder': return '#007AFF'; // Blue
      case 'suggestion': return '#34C759'; // Green
      default: return '#8E8E93'; // Gray
    }
  }, []);

  return {
    // Data
    smartNotifications,
    userPreferences, 
    recommendations,
    isLoading,
    error,
    
    // Methods
    loadButlerData,
    getPersonalizedGreeting,
    getSmartSuggestions,
    updatePreferences,
    dismissRecommendation,
    getNotificationPriorityColor,
    
    // Utils
    hasUnreadNotifications: (smartNotifications?.total_unread || 0) > 0,
    criticalCount: smartNotifications?.recent_with_priority?.filter(n => n.priority === 'high').length || 0,
    importantCount: smartNotifications?.recent_with_priority?.filter(n => n.priority === 'medium').length || 0,
    suggestionsCount: smartNotifications?.recent_with_priority?.filter(n => n.priority === 'low').length || 0,
    highPriorityRecommendations: recommendations.filter(r => r.confidence_score > 80),
  };
}
