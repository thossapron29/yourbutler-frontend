import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useI18n } from '@/contexts/I18nContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';

interface LanguageSwitcherProps {
  style?: any;
  showLabel?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  style, 
  showLabel = true 
}) => {
  const { language, setLanguage } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'borderColor');

  const toggleLanguage = () => {
    const newLanguage = language === 'th' ? 'en' : 'th';
    setLanguage(newLanguage);
  };

  const getCurrentLanguageDisplay = () => {
    return language === 'th' ? '🇹🇭 ไทย' : '🇺🇸 English';
  };

  const getNextLanguageDisplay = () => {
    return language === 'th' ? '🇺🇸 English' : '🇹🇭 ไทย';
  };

  if (!showLabel) {
    // Compact button version
    return (
      <TouchableOpacity 
        onPress={toggleLanguage}
        style={[
          styles.compactButton, 
          { backgroundColor: cardBackground, borderColor },
          style
        ]}
      >
        <Text style={[styles.compactButtonText, { color: textColor }]}>
          {language === 'th' ? '🇹🇭' : '🇺🇸'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        onPress={toggleLanguage}
        style={[styles.button, { backgroundColor: cardBackground, borderColor }]}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons name="language" size={20} color={tintColor} />
          <Text style={[styles.currentLanguage, { color: textColor }]}>
            {getCurrentLanguageDisplay()}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={textColor} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentLanguage: {
    fontSize: 14,
    fontWeight: '500',
  },
  compactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  compactButtonText: {
    fontSize: 16,
  },
});
