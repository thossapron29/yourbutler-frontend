import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  Alert,
  Switch,
  TextInput,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { apiClient } from '@/utils/api';

interface MarkAsPurchasedModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: string;
  productName: string;
}

export default function MarkAsPurchasedModal({ 
  visible, 
  onClose, 
  onSuccess, 
  productId, 
  productName 
}: MarkAsPurchasedModalProps) {
  const [createNew, setCreateNew] = useState(true);
  const [purchasedAt, setPurchasedAt] = useState('');
  const [expectedExpiry, setExpectedExpiry] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMarkAsPurchased = async () => {
    try {
      setLoading(true);
      
      const payload: any = {
        create_new: createNew,
      };
      
      if (purchasedAt) payload.purchased_at = purchasedAt;
      if (expectedExpiry) payload.expected_expiry = expectedExpiry;
      if (quantity) payload.quantity = parseFloat(quantity);
      if (notes) payload.notes = notes;

      await apiClient.markAsPurchased(productId, payload);

      Alert.alert(
        'Success!', 
        createNew 
          ? `"${productName}" marked as consumed and added to your inventory with new details.`
          : `"${productName}" marked as consumed.`,
        [{ text: 'OK', onPress: () => { onSuccess(); onClose(); } }]
      );
    } catch (error) {
      console.error('Failed to mark as purchased:', error);
      Alert.alert('Error', 'Failed to mark item as purchased');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const getExpiryDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          backgroundColor: 'white'
        }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: '#007AFF', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Mark as Purchased</Text>
          <TouchableOpacity onPress={handleMarkAsPurchased} disabled={loading}>
            <Text style={{ 
              color: loading ? '#ccc' : '#007AFF', 
              fontSize: 16, 
              fontWeight: '600' 
            }}>
              {loading ? 'Saving...' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          {/* Product Info */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <MaterialIcons name="shopping-cart" size={24} color="#007AFF" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{productName}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>Mark this item as consumed</Text>
            </View>
          </View>

          {/* Create New Item Option */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16 
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 8
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>Create New Item</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  Add a fresh item with updated details
                </Text>
              </View>
              <Switch
                value={createNew}
                onValueChange={setCreateNew}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={createNew ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Purchase Details */}
          {createNew && (
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 16 
            }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
                Purchase Details
              </Text>

              {/* Purchase Date */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                  Purchase Date (Optional)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16
                  }}
                  value={purchasedAt}
                  onChangeText={setPurchasedAt}
                  placeholder="YYYY-MM-DD or leave empty"
                />
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TouchableOpacity 
                    onPress={() => setPurchasedAt(getCurrentDate())}
                    style={{ 
                      backgroundColor: '#f0f0f0', 
                      padding: 8, 
                      borderRadius: 6, 
                      marginRight: 8 
                    }}
                  >
                    <Text style={{ fontSize: 12, color: '#007AFF' }}>Today</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Expected Expiry */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                  Expected Expiry (Optional)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16
                  }}
                  value={expectedExpiry}
                  onChangeText={setExpectedExpiry}
                  placeholder="YYYY-MM-DD or leave empty"
                />
                <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' }}>
                  {[7, 14, 30, 60].map(days => (
                    <TouchableOpacity 
                      key={days}
                      onPress={() => setExpectedExpiry(getExpiryDate(days))}
                      style={{ 
                        backgroundColor: '#f0f0f0', 
                        padding: 8, 
                        borderRadius: 6, 
                        marginRight: 8,
                        marginBottom: 8
                      }}
                    >
                      <Text style={{ fontSize: 12, color: '#007AFF' }}>+{days} days</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quantity */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                  Quantity (Optional)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16
                  }}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g., 1, 2.5"
                  keyboardType="numeric"
                />
              </View>

              {/* Notes */}
              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                  Notes (Optional)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    height: 80,
                    textAlignVertical: 'top'
                  }}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional notes..."
                  multiline
                />
              </View>
            </View>
          )}

          {/* Info */}
          <View style={{ 
            backgroundColor: '#f0f9ff', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 32,
            borderLeftWidth: 4,
            borderLeftColor: '#007AFF'
          }}>
            <Text style={{ fontSize: 14, color: '#666' }}>
              {createNew 
                ? "The current item will be marked as consumed, and a new item will be added to your inventory with the details you provide."
                : "The current item will be marked as consumed without creating a new item."
              }
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
