import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';
import { ButlerRecommendation } from '../utils/api';

interface ButlerRecommendationCardProps {
  recommendation: ButlerRecommendation;
  onDismiss: (id: string) => void;
  onAction?: (recommendation: ButlerRecommendation) => void;
}

export function ButlerRecommendationCard({ 
  recommendation, 
  onDismiss, 
  onAction 
}: ButlerRecommendationCardProps) {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'subtitleText');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'borderColor');

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'category_suggestion': return 'bulb-outline';
      case 'bulk_buy': return 'bag-outline';
      case 'usage_pattern': return 'analytics-outline';
      case 'seasonal': return 'leaf-outline';
      default: return 'information-circle-outline';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return '#34C759'; // Green
    if (score >= 60) return '#FF9500'; // Orange
    return '#8E8E93'; // Gray
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getRecommendationIcon(recommendation.type) as any} 
            size={20} 
            color={tintColor} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: textColor }]}>
            {recommendation.title}
          </Text>
          <View style={styles.confidenceContainer}>
            <View 
              style={[
                styles.confidenceDot, 
                { backgroundColor: getConfidenceColor(recommendation.confidence_score) }
              ]} 
            />
            <Text style={[styles.confidenceText, { color: subtitleColor }]}>
              {getConfidenceLabel(recommendation.confidence_score)}
            </Text>
          </View>
        </View>
        <Pressable 
          style={styles.dismissButton}
          onPress={() => onDismiss(recommendation.id)}
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color={subtitleColor} />
        </Pressable>
      </View>

      <Text style={[styles.description, { color: textColor }]}>
        {recommendation.description}
      </Text>

      {recommendation.estimated_savings && (
        <View style={styles.savingsContainer}>
          <Ionicons name="trending-down" size={16} color="#34C759" />
          <Text style={[styles.savingsText, { color: '#34C759' }]}>
            Estimated savings: ${recommendation.estimated_savings.toFixed(2)}
          </Text>
        </View>
      )}

      {recommendation.action_items && recommendation.action_items.length > 0 && (
        <View style={styles.actionItems}>
          {recommendation.action_items.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.actionItem}>
              <View style={[styles.bullet, { backgroundColor: tintColor }]} />
              <Text style={[styles.actionText, { color: subtitleColor }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}

      {onAction && (
        <Pressable 
          style={[styles.actionButton, { backgroundColor: tintColor + '15' }]}
          onPress={() => onAction(recommendation)}
        >
          <Text style={[styles.actionButtonText, { color: tintColor }]}>
            Apply Suggestion
          </Text>
          <Ionicons name="arrow-forward" size={16} color={tintColor} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionItems: {
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginRight: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
