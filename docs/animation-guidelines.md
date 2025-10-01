# YourButler Animation Guidelines

## Core Principles
- **Calm & Subtle**: Animations should enhance, not distract
- **Quick & Responsive**: 200-800ms duration range
- **Physics-based**: Use spring animations for natural feel
- **Purposeful**: Only animate when it improves UX

## Animation Types

### 1. Content Loading
```typescript
// Gentle fade-in with slight slide up
Animated.parallel([
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 800,
    useNativeDriver: true,
  }),
  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 600,
    useNativeDriver: true,
  }),
]).start();
```

### 2. Button Interactions
```typescript
// Subtle scale down on press
onPressIn={() => {
  Animated.spring(scaleAnim, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start();
}}
```

### 3. List Item Animations (Future)
```typescript
// Staggered animation for list items
items.forEach((item, index) => {
  Animated.timing(item.opacity, {
    toValue: 1,
    duration: 300,
    delay: index * 100, // Stagger by 100ms
    useNativeDriver: true,
  }).start();
});
```

### 4. Status Badge Transitions (Future)
```typescript
// Color transition for expiry status
Animated.timing(statusColor, {
  toValue: newColor,
  duration: 500,
  useNativeDriver: false, // Color animations need false
}).start();
```

## Best Practices

1. **Use Native Driver**: Always set `useNativeDriver: true` when possible
2. **Consistent Timing**: Use 300ms for quick interactions, 600-800ms for content
3. **Spring Physics**: Prefer spring over timing for button interactions
4. **Graceful Degradation**: Ensure app works even if animations fail

## Color Palette for Animations
- Primary Purple: #5F488B
- Light Purple: #8B7CB7  
- Soft Pink: #E57373
- Success Green: #4CAF50
- Warning Orange: #FF9500

## Performance Notes
- Keep animation duration under 1000ms
- Use transform properties (scale, translateX/Y) for best performance
- Avoid animating layout properties (width, height) when possible
- Test on lower-end devices
