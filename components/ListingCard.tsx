import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, MapPin, Calendar, Eye } from 'lucide-react-native';
import { Listing, CarListing } from '@/types/marketplace';
import { useMarketplace } from '@/hooks/marketplace-store';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  variant?: 'grid' | 'list';
}

export default function ListingCard({ listing, onPress, variant = 'grid' }: ListingCardProps) {
  const { favorites, toggleFavorite } = useMarketplace();
  const isFavorite = favorites.includes(listing.id);
  const isCar = listing.type === 'car';

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  if (variant === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={onPress} testID={`listing-${listing.id}`}>
        <Image source={{ uri: listing.images[0] }} style={styles.listImage} />
        <View style={styles.listContent}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle} numberOfLines={2}>{listing.title}</Text>
            <TouchableOpacity 
              onPress={() => toggleFavorite(listing.id)}
              style={styles.favoriteButton}
              testID={`favorite-${listing.id}`}
            >
              <Heart 
                size={20} 
                color={isFavorite ? '#F97316' : '#9CA3AF'}
                fill={isFavorite ? '#F97316' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.listPrice}>{formatPrice(listing.price)}</Text>
          
          <View style={styles.listMeta}>
            {isCar && (
              <Text style={styles.listMetaText}>
                {(listing as CarListing).year} • {(listing as CarListing).mileage.toLocaleString()} km
              </Text>
            )}
            <View style={styles.listLocation}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.listLocationText}>{listing.location}</Text>
            </View>
          </View>
          
          <View style={styles.listFooter}>
            <View style={styles.listStat}>
              <Eye size={14} color="#9CA3AF" />
              <Text style={styles.listStatText}>{listing.views}</Text>
            </View>
            <View style={styles.listStat}>
              <Calendar size={14} color="#9CA3AF" />
              <Text style={styles.listStatText}>{formatDate(listing.createdAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} testID={`listing-${listing.id}`}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.images[0] }} style={styles.gridImage} />
        <TouchableOpacity 
          style={styles.gridFavoriteButton}
          onPress={() => toggleFavorite(listing.id)}
          testID={`favorite-${listing.id}`}
        >
          <Heart 
            size={18} 
            color="white"
            fill={isFavorite ? '#F97316' : 'transparent'}
          />
        </TouchableOpacity>
        {listing.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={2}>{listing.title}</Text>
        <Text style={styles.gridPrice}>{formatPrice(listing.price)}</Text>
        
        {isCar && (
          <Text style={styles.gridMeta}>
            {(listing as CarListing).year} • {(listing as CarListing).mileage.toLocaleString()} km
          </Text>
        )}
        
        <View style={styles.gridLocation}>
          <MapPin size={12} color="#6B7280" />
          <Text style={styles.gridLocationText}>{listing.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid variant styles
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#F3F4F6',
  },
  gridFavoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 6,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  gridMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  gridLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  
  // List variant styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listImage: {
    width: 120,
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  listTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  listPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 6,
  },
  listMeta: {
    marginBottom: 8,
  },
  listMetaText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  listLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  listFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  listStatText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});