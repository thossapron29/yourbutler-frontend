# 🏗️ Component Architecture

## Component Hierarchy

```
📱 Home Screen (home.tsx)
│
├── 🎨 Animated.View (Page Transition)
│   │
│   ├── 📋 HeaderSection
│   │   ├── Greeting Text
│   │   ├── User Name
│   │   └── Action Buttons
│   │       ├── Notifications Button
│   │       └── Settings Button
│   │
│   ├── 🎯 SummaryBanner
│   │   ├── [If No Expiring Items]
│   │   │   └── All Good Banner
│   │   │       ├── Check Icon
│   │   │       ├── Title & Subtitle
│   │   │       └── Arrow Button → My Items
│   │   │
│   │   └── [If Has Expiring Items]
│   │       └── Shopping List CTA
│   │           ├── Bag Icon
│   │           ├── Title & Count
│   │           └── View List Button → Shopping List
│   │
│   ├── 📊 StatsSection
│   │   ├── Primary Stat Card (if expiring_soon > 0)
│   │   │   ├── Warning Icon
│   │   │   ├── Count
│   │   │   └── Label
│   │   │
│   │   └── Secondary Stats Grid
│   │       ├── Active Items Card
│   │       ├── Expiring Soon Card
│   │       └── Expired Card (if expired > 0)
│   │
│   ├── ⏰ ExpiringItemsSection
│   │   ├── Section Header
│   │   │   ├── Icon + Title + Count Badge
│   │   │   └── See All Button → My Items
│   │   │
│   │   ├── [If Has Items]
│   │   │   └── Items List (max 4)
│   │   │       └── ExpiringItemCard ×4
│   │   │           ├── Item Name
│   │   │           ├── Category
│   │   │           ├── Purchase Button
│   │   │           └── Status Badge
│   │   │
│   │   └── [If No Items]
│   │       └── Empty State
│   │           ├── Success Icon
│   │           ├── Title
│   │           └── Subtitle
│   │
│   └── ⚡ QuickAddSection
│       ├── Section Title
│       └── Horizontal Scroll
│           ├── Category Button ×4
│           │   ├── Icon
│           │   └── Label
│           │
│           └── More Button
│               ├── Add Icon
│               └── "More" Label
│
├── 🔵 Floating Add Button → Add Product
│
└── 📝 Mark as Purchased Modal
    └── (Conditional render)
```

## Data Flow

```
┌─────────────────────────────────────────┐
│          Home Component (Parent)         │
│                                          │
│  State:                                  │
│  - dashboardSummary                      │
│  - expiringItems                         │
│  - isLoading                             │
│  - isRefreshing                          │
│  - selectedProduct                       │
│  - markModalVisible                      │
│                                          │
│  Functions:                              │
│  - fetchDashboardData()                  │
│  - handleRefresh()                       │
│  - handleMarkAsPurchased()               │
│  - getGreeting()                         │
└─────────────────────────────────────────┘
                    │
                    │ Props ↓
        ┌───────────┴──────────┐
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────────┐
│ Presentational│      │   Data/Logic     │
│  Components   │      │   Components     │
└──────────────┘      └──────────────────┘
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────────┐
│ HeaderSection│      │ ExpiringItems    │
│              │      │ Section          │
│ Props:       │      │                  │
│ - greeting   │      │ Props:           │
└──────────────┘      │ - expiringItems  │
                      │ - onMarkAs...    │
┌──────────────┐      │ - primaryPurple  │
│ SummaryBanner│      └──────────────────┘
│              │               │
│ Props:       │               ▼
│ - hasExpiring│      ┌──────────────────┐
│ - count      │      │ ExpiringItemCard │
│ - color      │      │                  │
└──────────────┘      │ Props:           │
                      │ - item           │
┌──────────────┐      │ - onMarkAs...    │
│ StatsSection │      │ - primaryPurple  │
│              │      └──────────────────┘
│ Props:       │
│ - summary    │      ┌──────────────────┐
│ - color      │      │ QuickAddSection  │
└──────────────┘      │                  │
                      │ Props:           │
                      │ - categoryIcons  │
                      │ - primaryPurple  │
                      └──────────────────┘
```

## Event Flow

```
User Action                Component              Result
───────────              ──────────             ────────

[Tap Notification] → HeaderSection → Navigate to Notifications
[Tap Settings]     → HeaderSection → Navigate to Settings

[Tap All Good]     → SummaryBanner → Navigate to My Items
[Tap Shop CTA]     → SummaryBanner → Navigate to Shopping List

[Tap Stat Card]    → StatsSection  → Navigate to My Items

[Tap Item]         → ExpiringItem  → Show Item Details
[Tap Purchase ✓]   → ExpiringItem  → handleMarkAsPurchased()
                                       ↓
                                    Open Modal
                                       ↓
                                    Mark Product
                                       ↓
                                    Refresh Data

[Tap Category]     → QuickAdd      → Navigate to Add Product
                     Section          (with category preset)

[Tap + Button]     → Floating Btn  → Navigate to Add Product
```

## Component Communication

```
┌────────────────────────────────────────────┐
│                  Home (Parent)              │
│                                             │
│  Manages:                                   │
│  • Central state                            │
│  • Data fetching                            │
│  • Event handlers                           │
│  • Modal visibility                         │
└────────────────────────────────────────────┘
         │                    ▲
         │ Props Down         │ Events Up
         ▼                    │
┌─────────────────────────────────────────────┐
│            Child Components                  │
│                                              │
│  Receive:                                    │
│  • Data via props                            │
│  • Callback functions                        │
│  • Theme colors                              │
│                                              │
│  Return:                                     │
│  • JSX/UI only                               │
│  • Call parent callbacks for events          │
│  • No direct state mutation                  │
└──────────────────────────────────────────────┘
```

## Reusability Map

```
Component              Can be used in:
──────────            ─────────────────

HeaderSection    →    • Dashboard
                      • Profile Screen
                      • Any main screen

SummaryBanner    →    • Dashboard
                      • Overview screens
                      • Status displays

StatsSection     →    • Dashboard
                      • Analytics screens
                      • Reports

ExpiringItemCard →    • My Items List
                      • Search Results
                      • Category View
                      • Shopping List

QuickAddSection  →    • Add Product Screen
                      • Dashboard
                      • Category Browser
```

## File Size Comparison

```
Before Refactor:
┌─────────────────────────────────┐
│  home.tsx                        │
│  ████████████████████████  700  │
└─────────────────────────────────┘

After Refactor:
┌─────────────────────────────────┐
│  home.tsx                        │
│  ████████  227                   │
│                                  │
│  HeaderSection.tsx               │
│  ██  70                          │
│                                  │
│  SummaryBanner.tsx               │
│  ████  120                       │
│                                  │
│  StatsSection.tsx                │
│  █████  150                      │
│                                  │
│  ExpiringItemCard.tsx            │
│  ███  110                        │
│                                  │
│  ExpiringItemsSection.tsx        │
│  ████  130                       │
│                                  │
│  QuickAddSection.tsx             │
│  ███  100                        │
└─────────────────────────────────┘

Total: ~900 lines (but way more maintainable!)
```

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Readability** | 😵 Hard to read | 😊 Easy to read |
| **Maintainability** | 😰 Risky to change | 😌 Safe to change |
| **Reusability** | ❌ No | ✅ Yes |
| **Testability** | 😓 Hard to test | 🎯 Easy to test |
| **Performance** | 😐 OK | ⚡ Better |
| **Onboarding** | 😱 Takes hours | 🚀 Takes minutes |

---

**คำแนะนำ:** ใช้ pattern นี้กับหน้าอื่นๆ ด้วย เช่น:
- My Items Screen
- Shopping List Screen
- Add Product Screen
- Settings Screen
