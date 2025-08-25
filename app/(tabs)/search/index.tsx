import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  SafeAreaView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X, ChevronDown } from 'lucide-react-native';
import { useMarketplace } from '@/hooks/marketplace-store';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import { SearchFilters } from '@/types/marketplace';
import { carMakes, partCategories } from '@/mocks/marketplace-data';

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const { getFilteredListings, setSearchFilters, searchFilters } = useMarketplace();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localFilters, setLocalFilters] = useState<SearchFilters>({
    type: params.type as any || 'all',
    featured: params.featured === 'true',
  });

  useEffect(() => {
    setSearchFilters(localFilters);
  }, [localFilters]);

  const applyFilters = () => {
    setSearchFilters(localFilters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setLocalFilters({});
    setSearchFilters({});
    setShowFilters(false);
  };

  const sortOptions = [
    { label: 'Newest First', value: 'date-new' },
    { label: 'Oldest First', value: 'date-old' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <SearchBar
          value={localFilters.query || ''}
          onChangeText={(text) => setLocalFilters({ ...localFilters, query: text })}
          onFilterPress={() => setShowFilters(true)}
        />
        
        <View style={styles.controls}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.chip, localFilters.type === 'all' && styles.chipActive]}
              onPress={() => setLocalFilters({ ...localFilters, type: 'all' })}
            >
              <Text style={[styles.chipText, localFilters.type === 'all' && styles.chipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chip, localFilters.type === 'car' && styles.chipActive]}
              onPress={() => setLocalFilters({ ...localFilters, type: 'car' })}
            >
              <Text style={[styles.chipText, localFilters.type === 'car' && styles.chipTextActive]}>
                Cars
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.chip, localFilters.type === 'part' && styles.chipActive]}
              onPress={() => setLocalFilters({ ...localFilters, type: 'part' })}
            >
              <Text style={[styles.chipText, localFilters.type === 'part' && styles.chipTextActive]}>
                Parts
              </Text>
            </TouchableOpacity>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Text style={styles.viewToggleText}>{viewMode === 'grid' ? 'List' : 'Grid'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.resultCount}>
        {getFilteredListings.length} results found
      </Text>

      <FlatList
        data={getFilteredListings}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push(`/listing/${item.id}`)}
            variant={viewMode}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <View style={styles.priceInputs}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Min"
                    keyboardType="numeric"
                    value={localFilters.minPrice?.toString() || ''}
                    onChangeText={(text) => setLocalFilters({ 
                      ...localFilters, 
                      minPrice: text ? parseInt(text) : undefined 
                    })}
                  />
                  <Text style={styles.priceSeparator}>-</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Max"
                    keyboardType="numeric"
                    value={localFilters.maxPrice?.toString() || ''}
                    onChangeText={(text) => setLocalFilters({ 
                      ...localFilters, 
                      maxPrice: text ? parseInt(text) : undefined 
                    })}
                  />
                </View>
              </View>

              {/* Condition */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Condition</Text>
                <View style={styles.optionsGrid}>
                  {['new', 'foreign-used', 'local-used'].map((condition) => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.optionButton,
                        localFilters.condition === condition && styles.optionButtonActive
                      ]}
                      onPress={() => setLocalFilters({ ...localFilters, condition })}
                    >
                      <Text style={[
                        styles.optionText,
                        localFilters.condition === condition && styles.optionTextActive
                      ]}>
                        {condition.replace('-', ' ').charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.optionsGrid}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        localFilters.sortBy === option.value && styles.optionButtonActive
                      ]}
                      onPress={() => setLocalFilters({ ...localFilters, sortBy: option.value as any })}
                    >
                      <Text style={[
                        styles.optionText,
                        localFilters.sortBy === option.value && styles.optionTextActive
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#1E40AF',
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  chipTextActive: {
    color: 'white',
  },
  viewToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  viewToggleText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 12,
    color: '#6B7280',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  resetButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1E40AF',
  },
  applyButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});