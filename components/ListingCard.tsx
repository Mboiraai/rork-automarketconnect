import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, MapPin, Calendar, Eye } from 'lucide-react-native';
import { Listing, CarListing } from '@/types/marketplace';
import { useMarketplace } from '@/hooks/marketplace-store';
import theme from '@/lib/theme';
import Card from '@/components/ui/Card';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  variant?: 'grid' | 'list';
}

function ListingCardComponent({ listing, onPress, variant = 'grid' }: ListingCardProps) {
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
      <Card onPress={onPress} padded={false} style={styles.listCard} testID={`listing-${listing.id}`}>
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
      </Card>
    );
  }

  return (
    <Card onPress={onPress} padded={false} style={[styles.gridCard, { width: CARD_WIDTH }]} testID={`listing-${listing.id}`}>
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
    </Card>
  );
}

export default memo(ListingCardComponent);

const styles = StyleSheet.create({
  // Grid variant styles
  gridCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: theme.colors.gray[100],
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
    backgroundColor: theme.colors.secondary[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  gridContent: {
    padding: theme.spacing.md,
  },
  gridTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  gridPrice: {
    ...theme.typography.heading,
    color: theme.colors.primary[800],
    marginBottom: theme.spacing.xs,
  },
  gridMeta: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  gridLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLocationText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginLeft: 4,
  },
  
  // List variant styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  listImage: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.gray[100],
  },
  listContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  listTitle: {
    flex: 1,
    ...theme.typography.title,
    color: theme.colors.text,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  listPrice: {
    ...theme.typography.heading,
    color: theme.colors.primary[800],
    marginBottom: 6,
  },
  listMeta: {
    marginBottom: 8,
  },
  listMetaText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  listLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listLocationText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
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
    color: theme.colors.gray[400],
    marginLeft: 4,
  },
});