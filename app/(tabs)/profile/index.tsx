import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { 
  Settings, 
  Heart, 
  Package, 
  Star, 
  ChevronRight,
  LogOut,
  Shield,
  HelpCircle,
  Bell
} from 'lucide-react-native';
import { useMarketplace, useUserListings, useFavorites } from '@/hooks/marketplace-store';

export default function ProfileScreen() {
  const { currentUser } = useMarketplace();
  const userListings = useUserListings();
  const favorites = useFavorites();

  const menuItems = [
    { 
      icon: Package, 
      label: 'My Listings', 
      value: userListings.length.toString(),
      onPress: () => router.push('/search'),
      color: '#3B82F6'
    },
    { 
      icon: Heart, 
      label: 'Favorites', 
      value: favorites.length.toString(),
      onPress: () => router.push('/search'),
      color: '#F97316'
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      value: '3',
      onPress: () => Alert.alert('Notifications', 'Coming soon!'),
      color: '#10B981'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      onPress: () => Alert.alert('Settings', 'Coming soon!'),
      color: '#6B7280'
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      onPress: () => Alert.alert('Help', 'Contact support@automart.com'),
      color: '#8B5CF6'
    },
    { 
      icon: Shield, 
      label: 'Privacy Policy', 
      onPress: () => Alert.alert('Privacy Policy', 'View our privacy policy'),
      color: '#EC4899'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: currentUser?.avatar || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{currentUser?.name}</Text>
          <Text style={styles.email}>{currentUser?.email}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentUser?.rating || 0}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentUser?.reviewCount || 0}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userListings.length}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
          </View>

          {currentUser?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Shield size={16} color="white" />
              <Text style={styles.verifiedText}>Verified Seller</Text>
            </View>
          )}

          {currentUser?.isAdmin && (
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => router.push('/admin')}
            >
              <Text style={styles.adminButtonText}>Admin Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity 
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.value && (
                  <Text style={styles.menuValue}>{item.value}</Text>
                )}
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?')}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  adminButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  adminButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  menu: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  menuValue: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 12,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 20,
    marginBottom: 20,
  },
});