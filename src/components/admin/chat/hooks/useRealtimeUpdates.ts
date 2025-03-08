
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "../types";
import { Profile } from "@/lib/types";

export const useRealtimeUpdates = (
  profile: Profile | null,
  selectedUserId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  loadConversations: () => Promise<void>,
  markMessagesAsRead: (userId: string) => Promise<void>
) => {
  // Set up Supabase realtime subscription
  useEffect(() => {
    if (!profile) return;

    // Subscribe to new messages
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          // Update conversations list
          loadConversations();
          
          // Update messages if the conversation is currently selected
          if (selectedUserId && (newMessage.sender_id === selectedUserId || newMessage.receiver_id === selectedUserId)) {
            setMessages((prev) => [...prev, newMessage]);
            
            // If the message is from the selected user, mark it as read immediately
            if (newMessage.sender_id === selectedUserId && !newMessage.is_admin_message) {
              markMessagesAsRead(selectedUserId);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          // Reload conversations to update the unread counters
          loadConversations();
          
          // Also update currently displayed messages if needed
          if (selectedUserId) {
            // Re-fetch the messages to get the updated read status
            setMessages(prev => {
              // This forces a re-fetch of messages with updated read status
              return [...prev];
            });
          }
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, selectedUserId, loadConversations, markMessagesAsRead, setMessages]);
};
