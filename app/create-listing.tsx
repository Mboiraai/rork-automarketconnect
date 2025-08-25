import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import { useMarketplace } from '@/hooks/marketplace-store';
import { carMakes, partCategories } from '@/mocks/marketplace-data';

export default function CreateListingScreen() {
  const { type } = useLocalSearchParams();
  const { addListing } = useMarketplace();
  const [listingType, setListingType] = useState(type === 'part' ? 'part' : 'car');
  
  // Common fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [condition, setCondition] = useState<'new' | 'foreign-used' | 'local-used'>('foreign-used');
  
  // Car fields
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol');
  const [bodyType, setBodyType] = useState<'sedan' | 'suv' | 'hatchback' | 'coupe' | 'truck' | 'van' | 'convertible'>('sedan');
  const [color, setColor] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [features, setFeatures] = useState('');
  
  // Part fields
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [compatibility, setCompatibility] = useState('');
  const [warranty, setWarranty] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!title || !price || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const baseData = {
      title,
      price: parseInt(price),
      description,
      location,
      condition,
      images: [
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      ],
      status: 'active' as const,
      featured: false,
    };

    try {
      if (listingType === 'car') {
        await addListing({
          ...baseData,
          type: 'car',
          make: make || 'Toyota',
          model: model || 'Camry',
          year: parseInt(year) || 2020,
          mileage: parseInt(mileage) || 50000,
          transmission,
          fuelType,
          bodyType,
          color: color || 'Black',
          engineSize,
          features: features.split(',').map(f => f.trim()).filter(f => f),
        });
      } else {
        await addListing({
          ...baseData,
          type: 'part',
          category: category || 'Engine',
          brand: brand || 'Generic',
          partNumber,
          compatibility: compatibility.split(',').map(c => c.trim()).filter(c => c),
          condition: condition as any,
          warranty,
        });
      }

      Alert.alert('Success', 'Your listing has been created!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create listing');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Type Selection */}
        <View style={styles.typeSelection}>
          <TouchableOpacity 
            style={[styles.typeButton, listingType === 'car' && styles.typeButtonActive]}
            onPress={() => setListingType('car')}
          >
            <Text style={[styles.typeButtonText, listingType === 'car' && styles.typeButtonTextActive]}>
              Car
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeButton, listingType === 'part' && styles.typeButtonActive]}
            onPress={() => setListingType('part')}
          >
            <Text style={[styles.typeButtonText, listingType === 'part' && styles.typeButtonTextActive]}>
              Spare Part
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <TouchableOpacity style={styles.imageUpload}>
            <Camera size={32} color="#9CA3AF" />
            <Text style={styles.imageUploadText}>Add Photos</Text>
            <Text style={styles.imageUploadHint}>Up to 10 photos</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={listingType === 'car' ? 'e.g., 2020 Toyota Camry XLE' : 'e.g., BMW Brake Pads'}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Price (₦) *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your item in detail..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Condition</Text>
          <View style={styles.optionsRow}>
            {['new', 'foreign-used', 'local-used'].map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[styles.optionButton, condition === cond && styles.optionButtonActive]}
                onPress={() => setCondition(cond as any)}
              >
                <Text style={[styles.optionText, condition === cond && styles.optionTextActive]}>
                  {cond.replace('-', ' ').charAt(0).toUpperCase() + cond.slice(1).replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Type-specific fields */}
        {listingType === 'car' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Make</Text>
                <TextInput
                  style={styles.input}
                  value={make}
                  onChangeText={setMake}
                  placeholder="e.g., Toyota"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={model}
                  onChangeText={setModel}
                  placeholder="e.g., Camry"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={year}
                  onChangeText={setYear}
                  placeholder="e.g., 2020"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Mileage (km)</Text>
                <TextInput
                  style={styles.input}
                  value={mileage}
                  onChangeText={setMileage}
                  placeholder="e.g., 50000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Transmission</Text>
            <View style={styles.optionsRow}>
              {['automatic', 'manual'].map((trans) => (
                <TouchableOpacity
                  key={trans}
                  style={[styles.optionButton, transmission === trans && styles.optionButtonActive]}
                  onPress={() => setTransmission(trans as any)}
                >
                  <Text style={[styles.optionText, transmission === trans && styles.optionTextActive]}>
                    {trans.charAt(0).toUpperCase() + trans.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Features (comma separated)</Text>
            <TextInput
              style={styles.input}
              value={features}
              onChangeText={setFeatures}
              placeholder="e.g., Leather Seats, Sunroof, Navigation"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Part Details</Text>
            
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g., Brakes, Engine, Electrical"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              placeholder="e.g., Brembo, Denso"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Part Number (optional)</Text>
            <TextInput
              style={styles.input}
              value={partNumber}
              onChangeText={setPartNumber}
              placeholder="Enter part number"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Compatible Vehicles (comma separated)</Text>
            <TextInput
              style={styles.input}
              value={compatibility}
              onChangeText={setCompatibility}
              placeholder="e.g., Toyota Camry 2015-2020, Honda Accord 2018-2021"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Warranty (optional)</Text>
            <TextInput
              style={styles.input}
              value={warranty}
              onChangeText={setWarranty}
              placeholder="e.g., 6 months"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Listing</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  typeSelection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: '#1E40AF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 8,
  },
  imageUploadHint: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: '#1E40AF',
  },
  optionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 8,
    margin: 16,
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});