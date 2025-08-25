import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { Car, Package, TrendingUp, Shield, Clock, Users } from 'lucide-react-native';
import { useUserListings } from '@/hooks/marketplace-store';

export default function SellScreen() {
  const userListings = useUserListings();
  const activeListings = userListings.filter(l => l.status === 'active');
  const soldListings = userListings.filter(l => l.status === 'sold');

  const stats = [
    { label: 'Active Listings', value: activeListings.length, icon: TrendingUp, color: '#10B981' },
    { label: 'Sold Items', value: soldListings.length, icon: Shield, color: '#F97316' },
    { label: 'Total Views', value: userListings.reduce((acc, l) => acc + l.views, 0), icon: Users, color: '#3B82F6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <Icon size={24} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Create Listing Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What would you like to sell?</Text>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => router.push('/create-listing?type=car')}
            testID="sell-car-button"
          >
            <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
              <Car size={28} color="#3B82F6" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Sell a Car</Text>
              <Text style={styles.optionDescription}>
                List your vehicle with detailed specifications
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => router.push('/create-listing?type=part')}
            testID="sell-part-button"
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Package size={28} color="#F59E0B" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Sell Spare Parts</Text>
              <Text style={styles.optionDescription}>
                List auto parts and accessories
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Your Listings */}
        {userListings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Listings</Text>
              <TouchableOpacity onPress={() => router.push('/profile')}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {userListings.slice(0, 3).map((listing) => (
              <TouchableOpacity 
                key={listing.id}
                style={styles.listingCard}
                onPress={() => router.push(`/listing/${listing.id}`)}
              >
                <View style={styles.listingInfo}>
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <Text style={styles.listingPrice}>
                    ₦{listing.price.toLocaleString()}
                  </Text>
                  <View style={styles.listingMeta}>
                    <View style={[styles.statusBadge, 
                      { backgroundColor: listing.status === 'active' ? '#10B98115' : '#F9731615' }
                    ]}>
                      <Text style={[styles.statusText,
                        { color: listing.status === 'active' ? '#10B981' : '#F97316' }
                      ]}>
                        {listing.status}
                      </Text>
                    </View>
                    <Text style={styles.listingViews}>{listing.views} views</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips for Selling</Text>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>1.</Text>
            <Text style={styles.tipText}>Take clear, high-quality photos from multiple angles</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>2.</Text>
            <Text style={styles.tipText}>Write detailed and honest descriptions</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>3.</Text>
            <Text style={styles.tipText}>Set competitive prices based on market value</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipNumber}>4.</Text>
            <Text style={styles.tipText}>Respond quickly to buyer inquiries</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  listingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  listingViews: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipsContainer: {
    backgroundColor: '#EFF6FF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  tip: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
});