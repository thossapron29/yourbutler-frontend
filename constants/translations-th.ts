import { Translations } from './translations';

export const thTranslations: Translations = {
  common: {
    loading: 'รอสักครู่นะ...',
    refreshing: 'กำลังอัปเดต...',
    error: 'มีอะไรผิดพลาดนิดหน่อย',
    success: 'เยี่ยมมาก!',
    cancel: 'ไม่เป็นไร',
    confirm: 'ได้เลย',
    save: 'เก็บไว้',
    edit: 'ปรับแต่ง',
    delete: 'เอาออก',
    retry: 'ลองใหม่อีกครั้ง',
    back: 'กลับไป',
    goBack: 'กลับไป',
    next: 'ต่อไป',
    done: 'เรียบร้อย',
    ok: 'รับทราบ',
    apply: 'ใช้แบบนี้',
    seeAll: 'ดูเพิ่มเติม',
    locale: 'th-TH',
  },
  home: {
    title: 'หน้าหลัก',
    // Status messages
    expired: 'เลยเวลาดีๆ แล้ว',
    expiresToday: 'ควรใช้วันนี้',
    expiresTomorrow: 'ควรใช้ภายในพรุ่งนี้',
    daysLeft: 'ใช้ได้อีก {{days}} วัน',
    noCategory: 'ยังไม่จัดหมวดหมู่',
    
    // Monitoring message
    monitoringMessage: 'Alfred ได้เฝ้าดูของใช้ของคุณในวันนี้แล้ว และทุกอย่างดูดีมาก!',
    
    // Sections
    smartSuggestionsTitle: '✨ การแจ้งเตือนอ่อนโยน',
    fromYourButler: 'ฉันสังเกตเห็นบางอย่าง...',
    expiringSoon: 'ของที่ควรใช้เร็วๆ นี้',
    allGood: 'ทุกอย่างดูดีมาก!',
    noItemsExpiring: 'คุณพร้อมแล้วสำหรับสัปดาห์หน้า',
    
    // Stats
    activeItems: 'ของในบ้านคุณ',
    addedThisWeek: '+{{count}} ที่เพิ่มสัปดาห์นี้',
    tomorrow: '{{count}} ที่ควรดูพรุ่งนี้',
    butler: 'พ่อบ้านของคุณ',
    
    // Quick actions
    quickAdd: '✨ เพิ่มของอะไรหน่อย',
    favorites: '(ที่คุณชอบ)',
    more: 'เพิ่มเติม',
    
    // Shopping list
    shoppingListReady: 'รายการซื้อของคุณพร้อมแล้ว',
    itemsExpiringSoon: 'ฉันสังเกตเห็นว่ามี {{count}} รายการที่อาจต้องเติมใหม่เร็วๆ นี้ ให้ฉันเตรียมรายการซื้อของให้ไหม?',
    viewList: 'ดูรายการ',
    
    // Actions
    applySuggestion: 'ฟังดูดีนะ',
    wouldYouLikeToApply: 'ฉันมีข้อแนะนำ: {{title}} จะเป็นประโยชน์ไหม?',
    
    greetings: {
      morning: 'สวัสดีตอนเช้า',
      afternoon: 'สวัสดีตอนบ่าย', 
      evening: 'สวัสดีตอนเย็น',
      night: 'นอนหลับฝันดี',
      messages: {
        morning: 'มาเริ่มต้นวันใหม่ด้วยการดูของที่มีในบ้านกันเถอะ',
        afternoon: 'ลองมาดูสิ่งที่อาจต้องเอาใจใส่กันไหม?',
        evening: 'มาวางแผนสำหรับวันพรุ่งนี้ด้วยกันเถอะ',
        night: 'หลับให้สบาย ฉันจะคอยดูแลให้',
      },
    },
    dashboard: {
      totalItems: 'ทุกอย่างในบ้าน',
      expiringSoon: 'ควรตรวจดู',
      consumed: 'ใช้ไปเมื่อเร็วๆ นี้',
      noItems: 'พร้อมจะช่วยคุณเริ่มต้น',
      noExpiring: 'ไม่มีอะไรเร่งด่วนที่ต้องกังวล',
      allGood: 'ทุกอย่างดูดีมาก!',
      suggestions: 'ฉันมีข้อเสนอแนะอ่อนโยนๆ',
    },
    sections: {
      expiring: 'ของที่ควรใช้เร็วๆ นี้',
      recommendations: 'ข้อเสนอแนะที่มีใจ',
      quickAdd: 'เพิ่มของอะไรหน่อย',
      recentActivity: 'เกิดอะไรขึ้นบ้าง',
    },
    expiring: {
      expiresToday: 'ควรใช้วันนี้',
      expiresTomorrow: 'ควรใช้ภายในพรุ่งนี้',
      daysLeft: 'ใช้ได้อีก {{days}} วัน',
      expired: 'เลยเวลาดีๆ แล้ว',
    },
    smartSuggestions: {
      checkItems: 'ตรวจดูสิ่งที่ต้องให้ความสนใจ',
      addCategory: 'ลองพิจารณาเพิ่มของในหมวด {{category}}',
      reviewExpiry: 'มาดูวันหมดอายุแบบไม่เครียดกัน',
      updateInventory: 'ปรับปรุงสิ่งที่มีในบ้าน',
      setReminders: 'ตั้งการแจ้งเตือนที่มีประโยชน์',
    },
    quickActions: {
      addProduct: 'เพิ่มของใหม่',
      viewAll: 'ดูทุกอย่าง',
      settings: 'การตั้งค่า',
      notifications: 'การแจ้งเตือนของคุณ',
    },
    recommendations: {
      title: 'ข้อเสนอแนะที่มีใจ',
      viewAll: 'ดูไอเดียเพิ่มเติม',
      dismiss: 'ขอบคุณ ไม่ใช่ตอนนี้',
    },
    markAsPurchased: {
      button: 'ใช้หมดแล้ว',
      success: 'ขอบคุณที่แจ้งให้ทราบเรื่อง "{{name}}"',
      successWithNew: 'ฉันจดไว้แล้วว่าคุณใช้ "{{name}}" หมดแล้ว และเพิ่มของใหม่ไว้ในบ้าน',
    },
  },
  categories: {
    fruits: 'ผลไม้',
    vegetables: 'ผัก',
    dairy: 'นม/ผลิตภัณฑ์นม',
    meat: 'เนื้อสัตว์',
    pantry: 'ของแห้ง',
    fresh: 'สดใหม่',
    personal: 'ส่วนตัว',
    beauty: 'ความงาม',
    laundry: 'ซักผ้า',
    household: 'ในบ้าน',
    beverages: 'เครื่องดื่ม',
    snacks: 'ขนม',
    frozen: 'ของแช่แข็ง',
    other: 'อื่นๆ',
  },
  notifications: {
    title: 'ข้อความจากฉัน',
    subtitle: 'การแจ้งเตือนอย่างอ่อนโยน',
    empty: 'ทุกอย่างเรียบร้อยดี',
    loading: 'กำลังโหลด...',
    notFound: 'ไม่พบการแจ้งเตือนนี้',
    markAllRead: 'ล้างทั้งหมด',
    dates: {
      today: 'วันนี้',
      yesterday: 'เมื่อวาน',
    },
    types: {
      expiry: 'แจ้งเตือนอย่างอ่อนโยนเรื่องวันหมดอายุ',
      reminder: 'การแจ้งเตือนอย่างเป็นมิตร',
      welcome: 'ยินดีต้อนรับสู่บ้านของคุณ',
      system: 'ข้อความจากฉัน',
    },
    actions: {
      markAllRead: 'อ่านทั้งหมด',
      loadMore: 'โหลดเพิ่มเติม',
      loading: 'กำลังโหลด...',
      refresh: 'รีเฟรช',
      viewProduct: 'ดูรายละเอียดสินค้า',
      viewProductMessage: 'คุณต้องการดูข้อมูลของ "{{productName}}" หรือไม่?',
      viewProductButton: 'ดูสินค้า',
      viewThisProduct: 'ดูสินค้านี้',
      addToShoppingList: 'เพิ่มในรายการซื้อของ',
      addToShoppingListMessage: 'เพิ่ม "{{productName}}" ลงในรายการซื้อของหรือไม่?',
      addToShoppingListButton: 'เพิ่มเลย',
      addToShoppingListShort: 'เพิ่มในรายการซื้อของ',
    },
    metadata: {
      sentAt: 'ส่งเมื่อ',
      readAt: 'อ่านเมื่อ',
      status: 'สถานะ',
    },
    stats: {
      total: 'ทั้งหมด',
      unread: 'ยังไม่อ่าน',
      clicked: 'ดำเนินการแล้ว',
      today: 'วันนี้',
    },
    status: {
      delivered: 'ส่งแล้ว',
      failed: 'ส่งไม่สำเร็จ',
      sent: 'ส่งแล้ว',
      new: 'ใหม่',
      read: 'ดูแล้ว',
      clicked: 'อ่านแล้ว',
    },
    time: {
      justNow: 'เมื่อกี้นี้',
      minutesAgo: '{{minutes}} นาทีที่แล้ว',
      hoursAgo: '{{hours}} ชั่วโมงที่แล้ว',
      daysAgo: '{{days}} วันที่แล้ว',
    },
  },
};
