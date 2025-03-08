
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "../types";
import { toast } from "sonner";
import { Profile } from "@/lib/types";

export const useConversations = (profile: Profile | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  // Load conversations from database
  const loadConversations = async () => {
    if (!profile) return;
    
    setIsLoadingConversations(true);
    try {
      // Get all users who have sent messages
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          sender_id,
          message,
          created_at,
          read,
          profile:profiles!chat_messages_sender_id_fkey(full_name)
        `)
        .eq('is_admin_message', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to get unique conversations
      const conversationsMap = new Map<string, Conversation>();

      data?.forEach((msg) => {
        if (!conversationsMap.has(msg.sender_id)) {
          conversationsMap.set(msg.sender_id, {
            user_id: msg.sender_id,
            user_name: msg.profile?.full_name || 'Utilisateur',
            last_message: msg.message,
            last_message_date: msg.created_at,
            unread_count: msg.read ? 0 : 1,
          });
        } else if (!msg.read) {
          const conv = conversationsMap.get(msg.sender_id)!;
          conv.unread_count++;
          conversationsMap.set(msg.sender_id, conv);
        }
      });

      // Convert map to array and sort by date
      const sortedConversations = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime());

      setConversations(sortedConversations);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      toast.error("Impossible de charger les conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Update conversations state when reading messages
  const updateConversationReadStatus = (userId: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.user_id === userId 
          ? { ...conv, unread_count: 0 } 
          : conv
      )
    );
  };

  return {
    conversations,
    isLoadingConversations,
    loadConversations,
    updateConversationReadStatus,
  };
};
