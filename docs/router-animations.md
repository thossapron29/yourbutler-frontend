# Router Animation Guidelines

> **Calm & Warm Navigation Experience**
> 
> Consistent with YourButler's brand tone: gentle, intelligent, and user-friendly.

## 🎯 **Animation Philosophy**

### **Calm & Subtle**
- **No dramatic transitions** - animations should feel natural and gentle
- **Consistent timing** - 250ms for most transitions (not too fast, not too slow)
- **Physics-based feel** - smooth easing that feels responsive but calm

### **User-Centered**
- **Clear feedback** - users should know their action was registered
- **Predictable direction** - animations should make logical sense
- **Accessibility friendly** - respect user preferences for reduced motion

---

## 🛠 **Implementation**

### **Navigation Utilities**
```typescript
import { navigateGently, NavigationPresets } from '@/utils/navigation';

// Gentle navigation (default)
navigateGently('/(app)/my-items', NavigationPresets.gentle);

// Subtle for modals/overlays
navigateGently('/(app)/settings', NavigationPresets.subtle);

// Instant for auth flows
navigateGently('/(auth)/login', NavigationPresets.instant);
```

### **Animation Types**

#### **Gentle** (Default)
- **Use for**: Main navigation, tab switches, primary actions
- **Timing**: 250ms
- **Feel**: Smooth slide with gentle easing
- **Haptic**: None (too much feedback can be overwhelming)

#### **Subtle** 
- **Use for**: Modal-like screens, settings, notifications
- **Timing**: 250ms  
- **Feel**: Light fade or slide
- **Haptic**: Light impact (optional feedback for actions)

#### **Instant**
- **Use for**: Auth flows, error states, critical redirects
- **Timing**: No animation
- **Feel**: Immediate response
- **Haptic**: None

---

## 📱 **Platform Considerations**

### **iOS**
- Leverage native feel with `fade` animations
- Respect iOS navigation patterns
- Support swipe gestures naturally

### **Android**
- Use `slide_from_right` for stack navigation
- Material Design motion principles
- Consistent with Android navigation patterns

---

## ✅ **Best Practices**

### **DO**
- ✅ Use consistent timing (250ms)
- ✅ Test on both iOS and Android
- ✅ Consider user's accessibility settings
- ✅ Keep animations predictable and logical
- ✅ Use appropriate animation for the action type

### **DON'T**  
- ❌ Make animations too fast (<200ms) or too slow (>400ms)
- ❌ Use bouncy or dramatic easing
- ❌ Add animations for every micro-interaction
- ❌ Ignore platform conventions
- ❌ Overuse haptic feedback

---

## 🎨 **Animation Mapping**

| **Screen Type** | **Animation** | **Timing** | **Use Case** |
|---|---|---|---|
| **Tab Navigation** | Gentle | 250ms | Home → My Items → Shopping List |
| **Modal Screens** | Subtle | 250ms | Settings, Notifications, Profile |
| **Form Screens** | Gentle | 250ms | Add Product, Edit Item |
| **Auth Flows** | Instant | 0ms | Login → Dashboard |
| **Error States** | Instant | 0ms | Network errors, redirects |

---

## 🧪 **Testing Guidelines**

### **Performance**
- Test on lower-end devices
- Monitor frame rates during transitions
- Ensure animations don't block user interactions

### **User Experience**
- Test with accessibility settings enabled
- Verify animations feel consistent across the app
- Check that navigation feels predictable and logical

### **Edge Cases**
- Rapid navigation (user tapping quickly)
- Slow network conditions
- Background app states

---

## 🔮 **Future Considerations**

### **Advanced Animations**
- Shared element transitions for product images
- Parallax effects for empty states
- Staggered list animations for data loading

### **Micro-Interactions**
- Button press feedback
- Loading state transitions
- Error message animations

---

*Remember: The goal is to create a calm, warm, and intelligent user experience. Every animation should feel purposeful and gentle, never distracting from the core functionality.*
