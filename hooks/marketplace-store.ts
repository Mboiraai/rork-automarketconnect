import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  User,
  Listing,
  CarListing,
  PartListing,
  Message,
  Conversation,
  SearchFilters,
} from '@/types/marketplace';
import {
  mockUsers,
  mockCarListings,
  mockPartListings,
  mockMessages,
  mockConversations,
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
    currentUser: mockUsers[3],
    listings: [...mockCarListings, ...mockPartListings] as Listing[],
    conversations: mockConversations,
    messages: mockMessages,
    favorites: [],
    searchFilters: {},
    isLoading: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [favoritesData, userListings] = await Promise.all([
          AsyncStorage.getItem('favorites'),
          AsyncStorage.getItem('userListings'),
        ]);

        setState((prev) => ({
          ...prev,
          favorites: favoritesData ? JSON.parse(favoritesData) : [],
          listings: userListings
            ? ([...JSON.parse(userListings), ...mockCarListings, ...mockPartListings] as Listing[])
            : ([...mockCarListings, ...mockPartListings] as Listing[]),
        }));
      } catch (error) {
        console.error('loadData error', error);
      }
    };
    loadData();
  }, []);

  const toggleFavorite = useCallback(async (listingId: string) => {
    const newFavorites = state.favorites.includes(listingId)
      ? state.favorites.filter((id) => id !== listingId)
      : [...state.favorites, listingId];

    setState((prev) => ({ ...prev, favorites: newFavorites }));
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  }, [state.favorites]);

  const addListing = useCallback(
    async (
      listing: Omit<
        Listing,
        'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites' | 'seller'
      >,
    ) => {
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

      const updatedListings = [newListing, ...state.listings] as Listing[];
      setState((prev) => ({ ...prev, listings: updatedListings }));

      const userListings = updatedListings.filter((l) => l.sellerId === state.currentUser?.id);
      await AsyncStorage.setItem('userListings', JSON.stringify(userListings));

      return newListing;
    },
    [state.currentUser, state.listings],
  );

  const updateListing = useCallback(
    async (listingId: string, updates: Partial<Listing>) => {
      const updatedListings: Listing[] = state.listings.map((listing) => {
        if (listing.id !== listingId) return listing;
        const common = { updatedAt: new Date().toISOString() };
        if (listing.type === 'car') {
          const car = listing as CarListing;
          return { ...car, ...(updates as Partial<CarListing>), ...common } as Listing;
        }
        const part = listing as PartListing;
        return { ...part, ...(updates as Partial<PartListing>), ...common } as Listing;
      });

      setState((prev) => ({ ...prev, listings: updatedListings }));

      const userListings = updatedListings.filter((l) => l.sellerId === state.currentUser?.id);
      await AsyncStorage.setItem('userListings', JSON.stringify(userListings));
    },
    [state.listings, state.currentUser?.id],
  );

  const deleteListing = useCallback(
    async (listingId: string) => {
      const updatedListings: Listing[] = state.listings.filter((l) => l.id !== listingId);
      setState((prev) => ({ ...prev, listings: updatedListings }));

      const userListings = updatedListings.filter((l) => l.sellerId === state.currentUser?.id);
      await AsyncStorage.setItem('userListings', JSON.stringify(userListings));
    },
    [state.listings, state.currentUser?.id],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string, receiverId: string, listingId?: string) => {
      console.log('sendMessage', { conversationId, text, receiverId, listingId });
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

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        conversations: prev.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: newMessage,
                unreadCount:
                  newMessage.senderId === state.currentUser!.id ? conv.unreadCount : conv.unreadCount + 1,
              }
            : conv,
        ),
      }));
    },
    [state.currentUser?.id],
  );

  const markConversationRead = useCallback(
    (conversationId: string) => {
      const currentUserId = state.currentUser?.id;
      if (!currentUserId) return;

      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.conversationId === conversationId && m.receiverId === currentUserId ? { ...m, read: true } : m,
        ),
        conversations: prev.conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
      }));
    },
    [state.currentUser?.id],
  );

  const createConversation = useCallback(
    (participant: User, listing?: Listing): Conversation => {
      const existingConv = state.conversations.find(
        (c) => c.participants.some((p) => p.id === participant.id) && c.listing?.id === listing?.id,
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

      setState((prev) => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
      }));

      return newConversation;
    },
    [state.conversations, state.currentUser],
  );

  const setSearchFilters = useCallback((filters: SearchFilters) => {
    setState((prev) => ({ ...prev, searchFilters: filters }));
  }, []);

  const getFilteredListings = useMemo(() => {
    let filtered = [...state.listings];
    const filters = state.searchFilters;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (l) => l.title.toLowerCase().includes(query) || l.description.toLowerCase().includes(query),
      );
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter((l) => l.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((l) => l.price >= (filters.minPrice as number));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((l) => l.price <= (filters.maxPrice as number));
    }

    if (filters.make && filtered.some((l) => l.type === 'car')) {
      filtered = filtered.filter((l) => l.type !== 'car' || (l as CarListing).make === filters.make);
    }

    if ((filters as Partial<CarListing | PartListing>).condition) {
      const cond = (filters as Partial<CarListing | PartListing>).condition as string;
      filtered = filtered.filter((l) => (l as CarListing | PartListing).condition === cond);
    }

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

    return filtered as Listing[];
  }, [state.listings, state.searchFilters]);

  return {
    ...state,
    toggleFavorite,
    addListing,
    updateListing,
    deleteListing,
    sendMessage,
    markConversationRead,
    createConversation,
    setSearchFilters,
    getFilteredListings,
  };
});

export function useFavorites() {
  const { favorites, listings } = useMarketplace();
  return useMemo(() => listings.filter((l) => favorites.includes(l.id)), [favorites, listings]);
}

export function useUserListings() {
  const { currentUser, listings } = useMarketplace();
  return useMemo(
    () => listings.filter((l) => l.sellerId === currentUser?.id),
    [currentUser, listings],
  );
}

export function useConversation(conversationId: string) {
  const { conversations, messages } = useMarketplace();
  const conversation = conversations.find((c) => c.id === conversationId);
  const conversationMessages = useMemo(
    () =>
      messages
        .filter((m) => m.conversationId === conversationId)
        .slice()
        .sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ),
    [messages, conversationId],
  );
  return { conversation, messages: conversationMessages };
}