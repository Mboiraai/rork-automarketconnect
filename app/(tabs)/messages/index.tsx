import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { useMarketplace } from '@/hooks/marketplace-store';

export default function MessagesScreen() {
  const { conversations, currentUser, markConversationRead } = useMarketplace();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const renderConversation = ({ item }: { item: typeof conversations[0] }) => {
    const otherParticipant = item.participants.find(p => p.id !== currentUser?.id);
    if (!otherParticipant) return null;

    return (
      <TouchableOpacity 
        style={styles.conversationCard}
        onPress={() => router.push(`/chat/${item.id}`)}
        testID={`conversation-${item.id}`}
      >
        <Image 
          source={{ uri: otherParticipant.avatar || 'https://via.placeholder.com/50' }} 
          style={styles.avatar}
        />
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName}>{otherParticipant.name}</Text>
            <Text style={styles.timestamp}>{formatTime(item.lastMessage.timestamp)}</Text>
          </View>
          
          {item.listing && (
            <Text style={styles.listingTitle} numberOfLines={1}>
              Re: {item.listing.title}
            </Text>
          )}
          
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
            {item.lastMessage.text}
          </Text>
        </View>
        
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (conversations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <MessageCircle size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyText}>
            Start a conversation by contacting a seller
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
        onRefresh={() => {}}
        refreshing={false}
        testID="conversations-list"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    paddingVertical: 8,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  listingTitle: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});