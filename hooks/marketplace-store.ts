import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Listing, 
  CarListing, 
  PartListing, 
  Message, 
  Conversation,
  SearchFilters 
} from '@/types/marketplace';
import { 
  mockUsers, 
  mockCarListings, 
  mockPartListings, 
  mockMessages, 
  mockConversations 
} from '@/mocks/marketplace-data';

interface MarketplaceState {
  currentUser: User | null;
  listings: Listing[];
  conversations: Conversation[];
  messages: Message[];
  favorites: string[];
  searchFilters: SearchFilters;
  isLoading: boolean;
}

export const [MarketplaceProvider, useMarketplace] = createContextHook(() => {
  const [state, setState] = useState<MarketplaceState>({
    currentUser: mockUsers[3], // Current user with admin privileges
    listings: [...mockCarListings, ...mockPartListings] as Listing[],
    conversations: mockConversations,
    messages: mockMessages,
    favorites: [],
    searchFilters: {},
    isLoading: false,
  });

  // Load persisted data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [favoritesData, userListings] = await Promise.all([
          AsyncStorage.getItem('favorites'),
          AsyncStorage.getItem('userListings'),
        ]);

        setState(prev => ({
          ...prev,
          favorites: favoritesData ? JSON.parse(favoritesData) : [],
          listings: userListings 
            ? [...JSON.parse(userListings), ...mockCarListings, ...mockPartListings]
            : [...mockCarListings, ...mockPartListings],
        }));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const toggleFavorite = async (listingId: string) => {
    const newFavorites = state.favorites.includes(listingId)
      ? state.favorites.filter(id => id !== listingId)
      : [...state.favorites, listingId];
    
    setState(prev => ({ ...prev, favorites: newFavorites }));
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const addListing = async (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites' | 'seller'>) => {
    const newListing: Listing = {
      ...listing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      favorites: 0,
      seller: state.currentUser!,
      sellerId: state.currentUser!.id,
    } as Listing;

    const updatedListings = [newListing, ...state.listings];
    setState(prev => ({ ...prev, listings: updatedListings }));
    
    // Save user listings
    const userListings = updatedListings.filter(l => l.sellerId === state.currentUser?.id);
    await AsyncStorage.setItem('userListings', JSON.stringify(userListings));
    
    return newListing;
  };

  const updateListing = async (listingId: string, updates: Partial<Listing>) => {
    const updatedListings = state.listings.map(listing =>
      listing.id === listingId
        ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
        : listing
    );
    
    setState(prev => ({ ...prev, listings: updatedListings }));
    
    const userListings = updatedListings.filter(l => l.sellerId === state.currentUser?.id);
    await AsyncStorage.setItem('userListings', JSON.stringify(userListings));
  };

  const deleteListing = async (listingId: string) => {
    const updatedListings = state.listings.filter(l => l.id !== listingId);
    setState(prev => ({ ...prev, listings: updatedListings }));
    
    const userListings = updatedListings.filter(l => l.sellerId === state.currentUser?.id);
    await AsyncStorage.setItem('userListings', JSON.stringify(userListings));
  };

  const sendMessage = (conversationId: string, text: string, receiverId: string, listingId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: state.currentUser!.id,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
      listingId,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      conversations: prev.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, lastMessage: newMessage, unreadCount: conv.unreadCount + 1 }
          : conv
      ),
    }));
  };

  const createConversation = (participant: User, listing?: Listing): Conversation => {
    const existingConv = state.conversations.find(
      c => c.participants.some(p => p.id === participant.id) && c.listing?.id === listing?.id
    );
    
    if (existingConv) return existingConv;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants: [state.currentUser!, participant],
      lastMessage: {
        id: '',
        conversationId: '',
        senderId: state.currentUser!.id,
        receiverId: participant.id,
        text: `Hi, I'm interested in ${listing?.title || 'your listing'}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      unreadCount: 0,
      listing,
    };

    setState(prev => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
    }));

    return newConversation;
  };

  const setSearchFilters = (filters: SearchFilters) => {
    setState(prev => ({ ...prev, searchFilters: filters }));
  };

  const getFilteredListings = useMemo(() => {
    let filtered = [...state.listings];
    const filters = state.searchFilters;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query)
      );
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(l => l.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(l => l.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(l => l.price <= filters.maxPrice!);
    }

    if (filters.make && filtered.some(l => l.type === 'car')) {
      filtered = filtered.filter(l => 
        l.type !== 'car' || (l as CarListing).make === filters.make
      );
    }

    if (filters.condition) {
      filtered = filtered.filter(l => l.condition === filters.condition);
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'date-new':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'date-old':
          filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
      }
    }

    return filtered;
  }, [state.listings, state.searchFilters]);

  return {
    ...state,
    toggleFavorite,
    addListing,
    updateListing,
    deleteListing,
    sendMessage,
    createConversation,
    setSearchFilters,
    getFilteredListings,
  };
});

// Helper hooks
export function useFavorites() {
  const { favorites, listings } = useMarketplace();
  return useMemo(
    () => listings.filter(l => favorites.includes(l.id)),
    [favorites, listings]
  );
}

export function useUserListings() {
  const { currentUser, listings } = useMarketplace();
  return useMemo(
    () => listings.filter(l => l.sellerId === currentUser?.id),
    [currentUser, listings]
  );
}

export function useConversation(conversationId: string) {
  const { conversations, messages } = useMarketplace();
  const conversation = conversations.find(c => c.id === conversationId);
  const conversationMessages = messages.filter(m => m.conversationId === conversationId);
  return { conversation, messages: conversationMessages };
}