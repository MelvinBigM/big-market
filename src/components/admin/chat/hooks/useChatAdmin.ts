
import { useState, useEffect } from "react";
import { ChatMessage } from "../types";
import { Profile } from "@/lib/types";
import { useConversations } from "./useConversations";
import { useMessages } from "./useMessages";
import { useRealtimeUpdates } from "./useRealtimeUpdates";
import { formatChatDate } from "../utils/chatFormatters";

export const useChatAdmin = (profile: Profile | null) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { 
    conversations, 
    isLoadingConversations, 
    loadConversations, 
    updateConversationReadStatus 
  } = useConversations(profile);
  
  const { 
    messages, 
    loadMessages, 
    markMessagesAsRead, 
    sendMessage,
    setMessages
  } = useMessages(profile, updateConversationReadStatus);
  
  // Setup realtime updates
  useRealtimeUpdates(
    profile,
    selectedUserId,
    setMessages,
    loadConversations,
    markMessagesAsRead
  );

  // Load messages when user is selected and mark messages as read
  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  // Force refresh conversations when component mounts and periodically
  useEffect(() => {
    if (profile) {
      // Load conversations when component mounts
      loadConversations();
      
      // Set up a periodic refresh every 30 seconds
      const intervalId = setInterval(() => {
        if (profile) {
          loadConversations();
          // If a conversation is selected, mark its messages as read again
          if (selectedUserId) {
            markMessagesAsRead(selectedUserId);
          }
        }
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [profile, selectedUserId]);

  // Wrapper for sendMessage that includes the selected user
  const handleSendMessage = (message: string) => {
    if (selectedUserId) {
      sendMessage(message, selectedUserId);
    }
  };

  return {
    conversations,
    messages,
    selectedUserId,
    isLoadingConversations,
    setSelectedUserId,
    loadConversations,
    loadMessages,
    markMessagesAsRead,
    sendMessage: handleSendMessage,
    formatDate: formatChatDate,
  };
};
