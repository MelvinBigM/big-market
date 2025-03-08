
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "../types";
import { toast } from "sonner";
import { Profile } from "@/lib/types";

export const useMessages = (profile: Profile | null, updateConversationReadStatus: (userId: string) => void) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages for a specific user
  const loadMessages = async (userId: string) => {
    if (!profile) return;
    
    try {
      // Get messages between admin and selected user
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data as ChatMessage[]);
        
        // Mark unread messages from this user as read
        await markMessagesAsRead(userId);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error("Impossible de charger les messages");
    }
  };

  // Mark all messages as read for a user - optimized version
  const markMessagesAsRead = async (userId: string) => {
    if (!profile) return;
    
    try {
      // Find unread messages for this user
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('sender_id', userId)
        .eq('read', false);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const unreadIds = data.map(msg => msg.id);
        
        // Update messages to read in the database
        const { error: updateError } = await supabase
          .from('chat_messages')
          .update({ read: true })
          .in('id', unreadIds);
          
        if (updateError) throw updateError;
        
        // Also update the read status in our local state
        setMessages(prev => 
          prev.map(msg => 
            unreadIds.includes(msg.id) ? { ...msg, read: true } : msg
          )
        );
          
        // Update conversations locally via the passed function
        updateConversationReadStatus(userId);
        
        console.log(`Marked ${unreadIds.length} messages as read for user ${userId}`);
      }
    } catch (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
      toast.error("Impossible de mettre à jour les messages");
    }
  };

  // Send a message
  const sendMessage = async (message: string, userId: string) => {
    if (!message.trim() || !userId || !profile) return false;

    try {
      const { error } = await supabase.from('chat_messages').insert({
        message: message.trim(),
        sender_id: profile.id,
        receiver_id: userId,
        is_admin_message: true,
        read: false, // Make sure admin messages are also marked as unread initially
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      toast.error("Impossible d'envoyer votre réponse");
      return false;
    }
  };

  return {
    messages,
    loadMessages,
    markMessagesAsRead,
    sendMessage,
    setMessages
  };
};
