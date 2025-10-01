# การกำหนดเสียง Notification ผ่าน Backend API

## 📡 Backend API Examples

### 1. Notification แบบเสียงเริ่มต้น
```json
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "🏠 YourButler Reminder",
  "body": "Your milk expires in 2 days!",
  "sound": "default",
  "badge": 1,
  "data": {
    "type": "expiry_reminder",
    "productId": "uuid-here",
    "productName": "Milk",
    "daysUntilExpiry": 2
  }
}
```

### 2. Notification แบบเร่งด่วน (เสียงดัง)
```json
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "⚠️ YourButler Alert!",
  "body": "Your milk expires today!",
  "sound": "default",
  "badge": 1,
  "priority": "high",
  "data": {
    "type": "urgent_expiry",
    "productId": "uuid-here",
    "productName": "Milk",
    "daysUntilExpiry": 0
  }
}
```

### 3. Notification แบบไม่มีเสียง (Silent)
```json
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "🏠 YourButler Update",
  "body": "Product status updated",
  "sound": null,
  "badge": 1,
  "data": {
    "type": "status_update",
    "productId": "uuid-here"
  }
}
```

### 4. Custom Sound (ถ้ามีไฟล์เสียงกำหนดเอง)
```json
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "🏠 YourButler Reminder",
  "body": "Check your expiring items!",
  "sound": "notification-sound.wav",
  "badge": 1,
  "data": {
    "type": "custom_reminder"
  }
}
```

## 🔧 Frontend Settings สำหรับ Sound

### Android Channel Configuration
```javascript
await Notifications.setNotificationChannelAsync('urgent', {
  name: 'Urgent Notifications',
  importance: Notifications.AndroidImportance.MAX,
  sound: 'default',
  enableVibrate: true,
  vibrationPattern: [0, 250, 250, 250],
  enableLights: true,
  lightColor: '#FF0000',
});

await Notifications.setNotificationChannelAsync('normal', {
  name: 'Normal Notifications', 
  importance: Notifications.AndroidImportance.DEFAULT,
  sound: 'default',
  enableVibrate: false,
});
```

### iOS Sound Configuration
iOS จะใช้ sound ที่ระบุใน notification payload โดยอัตโนมัติ
- `"sound": "default"` = เสียงเริ่มต้น
- `"sound": "notification-sound.wav"` = เสียงกำหนดเอง
- `"sound": null` = ไม่มีเสียง

## 📱 การทดสอบ

1. **Test ผ่าน Frontend**: ใช้ปุ่ม Test และ Expiry ในหน้า Home
2. **Test ผ่าน Backend**: ส่ง push notification จาก server
3. **Test บนอุปกรณ์จริง**: Simulator อาจไม่มีเสียง

## ⚙️ การตั้งค่าเพิ่มเติม

### Volume Control
```javascript
// ไม่สามารถควบคุม volume ของ notification ได้
// ขึ้นอยู่กับการตั้งค่าของผู้ใช้
```

### Sound Priority
1. Custom sound file (ถ้ามี)
2. Default system sound
3. Silent (ถ้าผู้ใช้ปิดเสียง)
