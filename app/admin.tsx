import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { 
  Users, 
  Package, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react-native';
import { useMarketplace } from '@/hooks/marketplace-store';

export default function AdminDashboard() {
  const { listings, updateListing, deleteListing, currentUser } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'users'>('overview');

  if (!currentUser?.isAdmin) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorText}>Admin access required</Text>
      </View>
    );
  }

  const stats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    pendingListings: listings.filter(l => l.status === 'pending').length,
    totalViews: listings.reduce((acc, l) => acc + l.views, 0),
  };

  const handleApprove = (listingId: string) => {
    Alert.alert('Approve Listing', 'Are you sure you want to approve this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Approve', 
        onPress: () => {
          updateListing(listingId, { status: 'active' });
          Alert.alert('Success', 'Listing approved');
        }
      }
    ]);
  };

  const handleReject = (listingId: string) => {
    Alert.alert('Reject Listing', 'Are you sure you want to reject this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Reject', 
        style: 'destructive',
        onPress: () => {
          updateListing(listingId, { status: 'rejected' });
          Alert.alert('Success', 'Listing rejected');
        }
      }
    ]);
  };

  const handleDelete = (listingId: string) => {
    Alert.alert('Delete Listing', 'This action cannot be undone. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          deleteListing(listingId);
          Alert.alert('Success', 'Listing deleted');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'listings' && styles.tabActive]}
          onPress={() => setActiveTab('listings')}
        >
          <Text style={[styles.tabText, activeTab === 'listings' && styles.tabTextActive]}>
            Listings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
            Users
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={styles.content}>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
                <Package size={24} color="#3B82F6" />
                <Text style={styles.statValue}>{stats.totalListings}</Text>
                <Text style={styles.statLabel}>Total Listings</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
                <CheckCircle size={24} color="#10B981" />
                <Text style={styles.statValue}>{stats.activeListings}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
                <AlertCircle size={24} color="#F59E0B" />
                <Text style={styles.statValue}>{stats.pendingListings}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
                <Eye size={24} color="#8B5CF6" />
                <Text style={styles.statValue}>{stats.totalViews}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityItem}>
                <View style={styles.activityDot} />
                <Text style={styles.activityText}>New listing pending approval</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <View style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.activityText}>User verified successfully</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
              <View style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.activityText}>Listing reported by user</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'listings' && (
          <View style={styles.content}>
            {listings.map((listing) => (
              <View key={listing.id} style={styles.listingCard}>
                <View style={styles.listingHeader}>
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: 
                      listing.status === 'active' ? '#10B98115' :
                      listing.status === 'pending' ? '#F59E0B15' :
                      '#EF444415'
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: 
                        listing.status === 'active' ? '#10B981' :
                        listing.status === 'pending' ? '#F59E0B' :
                        '#EF4444'
                      }
                    ]}>
                      {listing.status}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.listingPrice}>₦{listing.price.toLocaleString()}</Text>
                <Text style={styles.listingSeller}>By: {listing.seller.name}</Text>
                
                <View style={styles.listingActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push(`/listing/${listing.id}`)}
                  >
                    <Eye size={16} color="#6B7280" />
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>
                  
                  {listing.status === 'pending' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#10B98115' }]}
                        onPress={() => handleApprove(listing.id)}
                      >
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={[styles.actionText, { color: '#10B981' }]}>
                          Approve
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#EF444415' }]}
                        onPress={() => handleReject(listing.id)}
                      >
                        <XCircle size={16} color="#EF4444" />
                        <Text style={[styles.actionText, { color: '#EF4444' }]}>
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#EF444415' }]}
                    onPress={() => handleDelete(listing.id)}
                  >
                    <XCircle size={16} color="#EF4444" />
                    <Text style={[styles.actionText, { color: '#EF4444' }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'users' && (
          <View style={styles.content}>
            <Text style={styles.comingSoon}>User management coming soon</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E40AF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#1E40AF',
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  listingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  listingSeller: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  listingActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  comingSoon: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 40,
  },
});