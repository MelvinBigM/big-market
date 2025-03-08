
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, Conversation } from "./types";
import { toast } from "sonner";
import { Profile } from "@/lib/types";

export const useChatAdmin = (profile: Profile | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Load conversations
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
        
        // Mark messages as read
        const unreadMessages = data
          .filter(msg => !msg.read && msg.sender_id === userId)
          .map(msg => msg.id);
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('chat_messages')
            .update({ read: true })
            .in('id', unreadMessages);
          
          // Update locally the unread count for the selected conversation
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.user_id === userId 
                ? { ...conv, unread_count: 0 } 
                : conv
            )
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error("Impossible de charger les messages");
    }
  };

  // Mark all messages as read for a user
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
        
        // Update messages to read
        await supabase
          .from('chat_messages')
          .update({ read: true })
          .in('id', unreadIds);
          
        // Update conversations locally
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.user_id === userId 
              ? { ...conv, unread_count: 0 } 
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
      toast.error("Impossible de mettre à jour les messages");
    }
  };

  // Send a message
  const sendMessage = async (message: string) => {
    if (!message.trim() || !selectedUserId || !profile) return;

    try {
      const { error } = await supabase.from('chat_messages').insert({
        message: message.trim(),
        sender_id: profile.id,
        receiver_id: selectedUserId,
        is_admin_message: true,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      toast.error("Impossible d'envoyer votre réponse");
    }
  };

  // Set up Supabase realtime subscription
  useEffect(() => {
    if (!profile) return;

    loadConversations();
    
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
      // This ensures unread messages are marked as read when a conversation is selected
      markMessagesAsRead(selectedUserId);
    }
  }, [selectedUserId]);

  return {
    conversations,
    messages,
    selectedUserId,
    isLoadingConversations,
    setSelectedUserId,
    loadConversations,
    loadMessages,
    markMessagesAsRead,
    sendMessage,
    formatDate,
  };
};
