import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send, Paperclip } from 'lucide-react-native';
import { useConversation, useMarketplace } from '@/hooks/marketplace-store';

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams();
  const { conversation, messages } = useConversation(conversationId as string);
  const { sendMessage, currentUser, markConversationRead } = useMarketplace();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const otherParticipant = conversation?.participants.find(p => p.id !== currentUser?.id);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (conversation?.id) {
      markConversationRead(conversation.id);
    }
  }, [conversation?.id, markConversationRead]);

  const handleSend = () => {
    if (!inputText.trim() || !conversation || !otherParticipant) return;
    
    sendMessage(
      conversation.id,
      inputText.trim(),
      otherParticipant.id,
      conversation.listing?.id
    );
    setInputText('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item }: { item: typeof messages[0] }) => {
    const isOwn = item.senderId === currentUser?.id;
    
    return (
      <View style={[styles.messageRow, isOwn && styles.messageRowOwn]}>
        {!isOwn && (
          <Image 
            source={{ uri: otherParticipant?.avatar || 'https://via.placeholder.com/32' }}
            style={styles.messageAvatar}
          />
        )}
        <View style={[styles.messageBubble, isOwn && styles.messageBubbleOwn]}>
          <Text style={[styles.messageText, isOwn && styles.messageTextOwn]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isOwn && styles.messageTimeOwn]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conversation not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: otherParticipant?.name || 'Chat',
          headerStyle: { backgroundColor: 'white' },
          headerTintColor: '#1E40AF',
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Listing Info */}
        {conversation.listing && (
          <View style={styles.listingInfo}>
            <Image 
              source={{ uri: conversation.listing.images[0] }}
              style={styles.listingImage}
            />
            <View style={styles.listingDetails}>
              <Text style={styles.listingTitle} numberOfLines={1}>
                {conversation.listing.title}
              </Text>
              <Text style={styles.listingPrice}>
                ₦{conversation.listing.price.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} testID="attach-button">
            <Paperclip size={20} color="#6B7280" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            testID="send-button"
          >
            <Send size={20} color={inputText.trim() ? 'white' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
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
  listingInfo: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listingImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  listingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  messagesList: {
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageRowOwn: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageBubbleOwn: {
    backgroundColor: '#1E40AF',
  },
  messageText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  messageTextOwn: {
    color: 'white',
  },
  messageTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  messageTimeOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    color: '#111827',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});