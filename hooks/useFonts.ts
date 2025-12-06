import { useFonts as useExpoFonts } from 'expo-font';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import {
  Anuphan_400Regular,
  Anuphan_500Medium,
  Anuphan_600SemiBold,
  Anuphan_700Bold,
} from '@expo-google-fonts/anuphan';

export const useFonts = () => {
  
  const [fontsLoaded] = useExpoFonts({
    // Figtree fonts (อังกฤษ/สากล)
    'Figtree-Regular': Figtree_400Regular,
    'Figtree-Medium': Figtree_500Medium,
    'Figtree-SemiBold': Figtree_600SemiBold,
    'Figtree-Bold': Figtree_700Bold,
    // Anuphan fonts (ภาษาไทย)
    'Anuphan-Regular': Anuphan_400Regular,
    'Anuphan-Medium': Anuphan_500Medium,
    'Anuphan-SemiBold': Anuphan_600SemiBold,
    'Anuphan-Bold': Anuphan_700Bold,
  });

  const getFontFamily = (weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
    const fontFamilies = {
      regular: 'Figtree-Regular',
      medium: 'Figtree-Medium',
      semibold: 'Figtree-SemiBold',
      bold: 'Figtree-Bold',
    };

    return fontFamilies[weight];
  };

  // เลือกฟอนต์ตามภาษา: ถ้าเป็นไทยใช้ Anuphan, อื่นๆ ใช้ Figtree
  const getLocalizedFontFamily = (
    language: 'th' | 'en',
    weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular'
  ) => {
    const figtree = {
      regular: 'Figtree-Regular',
      medium: 'Figtree-Medium',
      semibold: 'Figtree-SemiBold',
      bold: 'Figtree-Bold',
    } as const;
    const anuphan = {
      regular: 'Anuphan-Regular',
      medium: 'Anuphan-Medium',
      semibold: 'Anuphan-SemiBold',
      bold: 'Anuphan-Bold',
    } as const;
    return (language === 'th' ? anuphan : figtree)[weight];
  };

  return { fontsLoaded, getFontFamily, getLocalizedFontFamily };
};
