import { useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

/**
 * Custom hook that provides time-based color scheme
 * - Light mode: 6:00 AM - 6:00 PM (06:00 - 18:00)
 * - Dark mode: 6:00 PM - 6:00 AM (18:00 - 06:00)
 */
export function useTimeBasedColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const [timeBasedScheme, setTimeBasedScheme] = useState<'light' | 'dark'>(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  });

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const newScheme = hour >= 6 && hour < 18 ? 'light' : 'dark';
      setTimeBasedScheme(newScheme);
    };

    // Update immediately
    updateTheme();

    // Update every minute to check for time changes
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return timeBasedScheme;
}

/**
 * Hook that combines system preference with time-based scheme
 * You can choose which one to use by setting useTimeBased to true
 */
export function useAdaptiveColorScheme(useTimeBased: boolean = false) {
  const systemScheme = useSystemColorScheme();
  const timeBasedScheme = useTimeBasedColorScheme();
  
  return useTimeBased ? timeBasedScheme : systemScheme;
}
