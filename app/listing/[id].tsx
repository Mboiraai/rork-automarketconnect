import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar,
  Eye,
  MessageCircle,
  Phone,
  Shield,
  Star
} from 'lucide-react-native';
import { useMarketplace } from '@/hooks/marketplace-store';
import { CarListing, PartListing } from '@/types/marketplace';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { listings, favorites, toggleFavorite, createConversation, currentUser } = useMarketplace();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const listing = listings.find(l => l.id === id);
  
  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Listing not found</Text>
      </View>
    );
  }

  const isFavorite = favorites.includes(listing.id);
  const isOwner = listing.sellerId === currentUser?.id;
  const isCar = listing.type === 'car';

  const handleContact = () => {
    if (isOwner) {
      Alert.alert('Your Listing', 'This is your own listing');
      return;
    }
    const conversation = createConversation(listing.seller, listing);
    router.push(`/chat/${conversation.id}`);
  };

  const handleCall = () => {
    Alert.alert('Call Seller', `Call ${listing.seller.phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log('Calling...') }
    ]);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={listing.images}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
          />
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {listing.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === activeImageIndex && styles.indicatorActive
                ]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.imageActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleFavorite(listing.id)}
            >
              <Heart 
                size={24} 
                color="white"
                fill={isFavorite ? '#F97316' : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Listing Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>₦{listing.price.toLocaleString()}</Text>

          {/* Location and Date */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.metaText}>{listing.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.metaText}>{formatDate(listing.createdAt)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={16} color="#6B7280" />
              <Text style={styles.metaText}>{listing.views} views</Text>
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specGrid}>
              {isCar ? (
                <>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Make</Text>
                    <Text style={styles.specValue}>{(listing as CarListing).make}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Model</Text>
                    <Text style={styles.specValue}>{(listing as CarListing).model}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Year</Text>
                    <Text style={styles.specValue}>{(listing as CarListing).year}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Mileage</Text>
                    <Text style={styles.specValue}>
                      {(listing as CarListing).mileage.toLocaleString()} km
                    </Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Transmission</Text>
                    <Text style={styles.specValue}>{(listing as CarListing).transmission}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Fuel Type</Text>
                    <Text style={styles.specValue}>{(listing as CarListing).fuelType}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Body Type</Text>
                    <Text style={styles.specValue}>{(listing as CarListing).bodyType}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Color</Text>
                    <Text style={styles.specValue}>{(listing as CarListing).color}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Category</Text>
                    <Text style={styles.specValue}>{(listing as PartListing).category}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Brand</Text>
                    <Text style={styles.specValue}>{(listing as PartListing).brand}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Condition</Text>
                    <Text style={styles.specValue}>{listing.condition}</Text>
                  </View>
                  {(listing as PartListing).partNumber && (
                    <View style={styles.specItem}>
                      <Text style={styles.specLabel}>Part Number</Text>
                      <Text style={styles.specValue}>{(listing as PartListing).partNumber}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Features/Compatibility */}
          {isCar && (listing as CarListing).features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featureGrid}>
                {(listing as CarListing).features.map((feature, index) => (
                  <View key={index} style={styles.featureChip}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {!isCar && (listing as PartListing).compatibility.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Compatible With</Text>
              {(listing as PartListing).compatibility.map((item, index) => (
                <Text key={index} style={styles.compatibilityItem}>• {item}</Text>
              ))}
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerCard}>
              <Image 
                source={{ uri: listing.seller.avatar || 'https://via.placeholder.com/60' }}
                style={styles.sellerAvatar}
              />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerHeader}>
                  <Text style={styles.sellerName}>{listing.seller.name}</Text>
                  {listing.seller.isVerified && (
                    <Shield size={16} color="#10B981" />
                  )}
                </View>
                <View style={styles.sellerRating}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {listing.seller.rating} ({listing.seller.reviewCount} reviews)
                  </Text>
                </View>
                <Text style={styles.sellerLocation}>{listing.seller.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {!isOwner && (
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleCall}
          >
            <Phone size={20} color="#10B981" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={handleContact}
          >
            <MessageCircle size={20} color="white" />
            <Text style={styles.messageButtonText}>Message Seller</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 16,
    color: '#6B7280',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: width,
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: 'white',
    width: 24,
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specItem: {
    width: '50%',
    marginBottom: 16,
  },
  specLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#1E40AF',
  },
  compatibilityItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sellerSection: {
    marginBottom: 100,
  },
  sellerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  sellerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  sellerLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    marginRight: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  messageButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1E40AF',
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});