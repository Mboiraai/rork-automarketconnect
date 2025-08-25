import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { TrendingUp, Car, Package, Star } from 'lucide-react-native';
import { useMarketplace } from '@/hooks/marketplace-store';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import { CarListing } from '@/types/marketplace';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { listings, currentUser } = useMarketplace();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredListings = listings.filter(l => l.featured);
  const recentListings = [...listings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const categories = [
    { id: 'all', title: 'All', icon: TrendingUp, color: '#3B82F6' },
    { id: 'cars', title: 'Cars', icon: Car, color: '#10B981' },
    { id: 'parts', title: 'Parts', icon: Package, color: '#F59E0B' },
    { id: 'featured', title: 'Featured', icon: Star, color: '#F97316' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{currentUser?.name} 👋</Text>
          {currentUser?.isAdmin && (
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => router.push('/admin')}
            >
              <Text style={styles.adminButtonText}>Admin Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => router.push('/search')}
          />
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TouchableOpacity 
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color + '15' }]}
                onPress={() => router.push(`/search?type=${category.id}`)}
              >
                <Icon size={24} color={category.color} />
                <Text style={[styles.categoryText, { color: category.color }]}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Listings</Text>
              <TouchableOpacity onPress={() => router.push('/search?featured=true')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredListings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.featuredCard}>
                  <ListingCard
                    listing={item}
                    onPress={() => router.push(`/listing/${item.id}`)}
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* Recent Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Listings</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {recentListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onPress={() => router.push(`/listing/${listing.id}`)}
              />
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listings.filter(l => l.type === 'car').length}</Text>
            <Text style={styles.statLabel}>Cars</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listings.filter(l => l.type === 'part').length}</Text>
            <Text style={styles.statLabel}>Parts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listings.filter(l => l.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  adminButton: {
    marginTop: 12,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  adminButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  featuredCard: {
    marginLeft: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});