// Translation keys and types
export interface Translations {
  common: {
    loading: string;
    refreshing: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    retry: string;
    back: string;
    goBack: string;
    next: string;
    done: string;
    ok: string;
    apply: string;
    seeAll: string;
    locale: string;
  };
  home: {
    title: string;
    // Status messages
    expired: string;
    expiresToday: string;
    expiresTomorrow: string;
    daysLeft: string;
    noCategory: string;
    
    // Sections
    smartSuggestionsTitle: string;
    fromYourButler: string;
    expiringSoon: string;
    allGood: string;
    noItemsExpiring: string;
    
    // Stats
    activeItems: string;
    addedThisWeek: string;
    tomorrow: string;
    butler: string;
    
    // Quick actions
    quickAdd: string;
    favorites: string;
    more: string;
    
    // Shopping list
    shoppingListReady: string;
    itemsExpiringSoon: string;
    viewList: string;
    
    // Actions
    applySuggestion: string;
    wouldYouLikeToApply: string;
    
    greetings: {
      morning: string;
      afternoon: string;
      evening: string;
      night: string;
      messages: {
        morning: string;
        afternoon: string;
        evening: string;
        night: string;
      };
    };
    dashboard: {
      totalItems: string;
      expiringSoon: string;
      consumed: string;
      noItems: string;
      noExpiring: string;
      allGood: string;
      suggestions: string;
    };
    sections: {
      expiring: string;
      recommendations: string;
      quickAdd: string;
      recentActivity: string;
    };
    expiring: {
      expiresToday: string;
      expiresTomorrow: string;
      daysLeft: string;
      expired: string;
    };
    smartSuggestions: {
      checkItems: string;
      addCategory: string;
      reviewExpiry: string;
      updateInventory: string;
      setReminders: string;
    };
    quickActions: {
      addProduct: string;
      viewAll: string;
      settings: string;
      notifications: string;
    };
    recommendations: {
      title: string;
      viewAll: string;
      dismiss: string;
    };
    markAsPurchased: {
      button: string;
      success: string;
      successWithNew: string;
    };
  };
  categories: {
    fruits: string;
    vegetables: string;
    dairy: string;
    meat: string;
    pantry: string;
    fresh: string;
    personal: string;
    beauty: string;
    laundry: string;
    household: string;
    beverages: string;
    snacks: string;
    frozen: string;
    other: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    empty: string;
    loading: string;
    notFound: string;
    markAllRead: string;
    dates: {
      today: string;
      yesterday: string;
    };
    types: {
      expiry: string;
      reminder: string;
      welcome: string;
      system: string;
    };
    stats: {
      total: string;
      unread: string;
      clicked: string;
      today: string;
    };
    actions: {
      markAllRead: string;
      loadMore: string;
      loading: string;
      refresh: string;
      viewProduct: string;
      viewProductMessage: string;
      viewProductButton: string;
      viewThisProduct: string;
      addToShoppingList: string;
      addToShoppingListMessage: string;
      addToShoppingListButton: string;
      addToShoppingListShort: string;
    };
    metadata: {
      sentAt: string;
      readAt: string;
      status: string;
    };
    status: {
      delivered: string;
      failed: string;
      sent: string;
      new: string;
      read: string;
      clicked: string;
    };
    time: {
      justNow: string;
      minutesAgo: string;
      hoursAgo: string;
      daysAgo: string;
    };
  };
}

export type Language = 'th' | 'en';
export type TranslationKey = keyof Translations;
export type NestedTranslationKey<T> = T extends object ? {
  [K in keyof T]: T[K] extends object ? `${string & K}.${NestedTranslationKey<T[K]>}` : string & K
}[keyof T] : never;
