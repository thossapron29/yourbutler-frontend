import { useFonts as useExpoFonts } from 'expo-font';
import {
  Anuphan_400Regular,
  Anuphan_500Medium,
  Anuphan_600SemiBold,
  Anuphan_700Bold,
} from '@expo-google-fonts/anuphan';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { useI18n } from '@/contexts/I18nContext';

export const useFonts = () => {
  const { language } = useI18n();
  
  const [fontsLoaded] = useExpoFonts({
    // Thai fonts (Anuphan)
    'Anuphan-Regular': Anuphan_400Regular,
    'Anuphan-Medium': Anuphan_500Medium,
    'Anuphan-SemiBold': Anuphan_600SemiBold,
    'Anuphan-Bold': Anuphan_700Bold,
    
    // English fonts (Nunito)
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
  });

  const getFontFamily = (weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
    const fontFamilies = {
      th: {
        regular: 'Anuphan-Regular',
        medium: 'Anuphan-Medium',
        semibold: 'Anuphan-SemiBold',
        bold: 'Anuphan-Bold',
      },
      en: {
        regular: 'Nunito-Regular',
        medium: 'Nunito-Medium',
        semibold: 'Nunito-SemiBold',
        bold: 'Nunito-Bold',
      },
    };

    return fontFamilies[language][weight];
  };

  return { fontsLoaded, getFontFamily };
};
