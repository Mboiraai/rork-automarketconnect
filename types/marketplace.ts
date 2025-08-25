export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  joinedDate: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isAdmin?: boolean;
}

export interface CarListing {
  id: string;
  type: 'car';
  title: string;
  price: number;
  images: string[];
  description: string;
  sellerId: string;
  seller: User;
  createdAt: string;
  updatedAt: string;
  views: number;
  favorites: number;
  status: 'active' | 'sold' | 'pending' | 'rejected';
  featured: boolean;
  
  // Car specific
  make: string;
  model: string;
  year: number;
  mileage: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  bodyType: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'truck' | 'van' | 'convertible';
  color: string;
  condition: 'new' | 'foreign-used' | 'local-used';
  engineSize?: string;
  vin?: string;
  features: string[];
  location: string;
}

export interface PartListing {
  id: string;
  type: 'part';
  title: string;
  price: number;
  images: string[];
  description: string;
  sellerId: string;
  seller: User;
  createdAt: string;
  updatedAt: string;
  views: number;
  favorites: number;
  status: 'active' | 'sold' | 'pending' | 'rejected';
  featured: boolean;
  
  // Part specific
  category: string;
  partNumber?: string;
  compatibility: string[];
  condition: 'new' | 'used' | 'refurbished';
  brand: string;
  warranty?: string;
  location: string;
}

export type Listing = CarListing | PartListing;

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  listingId?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  listing?: Listing;
}

export interface SearchFilters {
  query?: string;
  type?: 'car' | 'part' | 'all';
  minPrice?: number;
  maxPrice?: number;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  condition?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  location?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'date-new' | 'date-old';
}