# Home Screen Components

โครงสร้าง Components ที่ถูก Refactor ออกมาจาก Home Screen เพื่อให้โค้ดอ่านง่ายและบำรุงรักษาได้ดีขึ้น

## 📁 Component Structure

```
components/home/
├── HeaderSection.tsx           # ส่วนหัวพร้อมชื่อผู้ใช้และปุ่มต่างๆ
├── SummaryBanner.tsx          # แบนเนอร์สรุป (All Good / Shopping List)
├── StatsSection.tsx           # สถิติแดชบอร์ด
├── ExpiringItemCard.tsx       # การ์ดแสดงสินค้าแต่ละรายการ
├── ExpiringItemsSection.tsx   # รายการสินค้าที่กำลังจะหมดอายุ
├── QuickAddSection.tsx        # ปุ่มเพิ่มสินค้าด่วนตามหมวดหมู่
└── README.md                  # เอกสารนี้
```

## 🧩 Components Overview

### 1. **HeaderSection**
ส่วนหัวของหน้า Home แสดง:
- คำทักทาย (เช้า/บ่าย/เย็น/ดึก)
- ชื่อผู้ใช้
- ปุ่มแจ้งเตือน (Notifications)
- ปุ่มตั้งค่า (Settings)

**Props:**
```typescript
{
  greeting: string;
}
```

### 2. **SummaryBanner**
แบนเนอร์สรุปสถานะ มี 2 แบบ:
- **All Good**: เมื่อไม่มีสินค้าที่กำลังจะหมดอายุ
- **Shopping List CTA**: เมื่อมีสินค้าที่กำลังจะหมดอายุ

**Props:**
```typescript
{
  hasExpiringItems: boolean;
  expiringCount: number;
  primaryPurple: string;
}
```

### 3. **StatsSection**
แสดงสถิติในรูปแบบการ์ด:
- **Primary Stat**: สินค้าที่กำลังจะหมดอายุ (ถ้ามี)
- **Secondary Stats Grid**:
  - จำนวนสินค้าทั้งหมด (Active Items)
  - สินค้าที่กำลังจะหมดอายุ (Expiring Soon)
  - สินค้าที่หมดอายุแล้ว (Expired) - แสดงเฉพาะเมื่อมี

**Props:**
```typescript
{
  dashboardSummary: DashboardSummary | null;
  primaryPurple: string;
}
```

### 4. **ExpiringItemCard**
การ์ดแสดงรายละเอียดสินค้าแต่ละชิ้น:
- ชื่อสินค้า
- หมวดหมู่
- สถานะการหมดอายุ (วันที่เหลือ)
- ปุ่มทำเครื่องหมายว่าซื้อแล้ว

**Props:**
```typescript
{
  item: ExpiringProduct;
  onMarkAsPurchased: (id: string, name: string) => void;
  primaryPurple: string;
}
```

**Features:**
- คำนวณจำนวนวันที่เหลือจนหมดอายุ
- แสดงสถานะด้วยสีที่เหมาะสม:
  - 🔴 Red: หมดอายุแล้ว / หมดอายุวันนี้
  - 🟠 Orange: หมดอายุพรุ่งนี้ / 2-3 วัน
  - 🟣 Purple: 4-7 วัน
  - ⚫ Gray: มากกว่า 7 วัน

### 5. **ExpiringItemsSection**
ส่วนแสดงรายการสินค้าที่กำลังจะหมดอายุ:
- หัวข้อพร้อมไอคอนและจำนวนสินค้า
- ปุ่ม "See All" ไปยังหน้ารายการทั้งหมด
- แสดงสินค้า 4 รายการแรก
- Empty state เมื่อไม่มีสินค้า

**Props:**
```typescript
{
  expiringItems: ExpiringProduct[];
  onMarkAsPurchased: (id: string, name: string) => void;
  primaryPurple: string;
}
```

### 6. **QuickAddSection**
ปุ่มเพิ่มสินค้าด่วนตามหมวดหมู่:
- แสดงหมวดหมู่ยอดนิยม 4 หมวด
- ไอคอนและชื่อหมวดหมู่
- ปุ่ม "More" สำหรับเพิ่มสินค้าทั่วไป
- Scroll ได้แนวนอน

**Props:**
```typescript
{
  categoryIcons: Record<string, IconName>;
  primaryPurple: string;
}
```

## 🔄 Component Flow

```
Home Screen (home.tsx)
├── HeaderSection
├── SummaryBanner
├── StatsSection
├── ExpiringItemsSection
│   └── ExpiringItemCard (multiple)
└── QuickAddSection
```

## 💡 Benefits ของการ Refactor

1. **อ่านง่ายขึ้น** - แยก logic ตาม component ทำให้เข้าใจโค้ดง่ายขึ้น
2. **Reusable** - สามารถนำ component ไปใช้ในหน้าอื่นได้
3. **Maintainable** - แก้ไขส่วนใดส่วนหนึ่งได้โดยไม่กระทบส่วนอื่น
4. **Testable** - ทดสอบแต่ละ component แยกกันได้
5. **Performance** - แต่ละ component จัดการ state และ re-render ของตัวเองได้ดีขึ้น

## 📝 Usage Example

```typescript
import HeaderSection from "../../components/home/HeaderSection";
import SummaryBanner from "../../components/home/SummaryBanner";
// ... other imports

export default function Home() {
  const primaryPurple = "#5F488B";
  
  return (
    <ScrollView>
      <HeaderSection greeting="Good morning" />
      
      <SummaryBanner
        hasExpiringItems={expiringItems?.length > 0}
        expiringCount={expiringItems?.length}
        primaryPurple={primaryPurple}
      />
      
      {/* ... other components */}
    </ScrollView>
  );
}
```

## 🎨 Design System

Components ใช้ theme colors จาก `useThemeColor`:
- `background` - สีพื้นหลังหลัก
- `cardBackground` - สีพื้นหลังการ์ด
- `text` - สีข้อความหลัก
- `subtitleText` - สีข้อความรอง
- `borderColor` - สีเส้นขอบ

และสีพิเศษ:
- `#5F488B` - Primary Purple
- `#FF9500` - Orange (Warning/Shopping)
- `#D32F2F` - Red (Expired)
- `#F57C00` - Orange (Expiring Soon)
- `#34C759` - Green (Success)

## 🚀 Next Steps

สามารถเพิ่มความสามารถได้ในอนาคต:
- [ ] เพิ่ม animation transitions ระหว่าง components
- [ ] เพิ่ม skeleton loading states
- [ ] เพิ่ม accessibility (a11y) features
- [ ] เพิ่ม unit tests สำหรับแต่ละ component
- [ ] สร้าง Storybook สำหรับ component showcase
