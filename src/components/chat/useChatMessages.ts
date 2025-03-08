
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './types';

export const useChatMessages = (userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Mark client-side messages from admin as read
  const markAdminMessagesAsRead = useCallback(async () => {
    try {
      // Find unread messages from admin
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('receiver_id', userId)
        .eq('is_admin_message', true)
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
        
        console.log(`Marked ${unreadIds.length} admin messages as read`);
        setUnreadCount(0);
        
        // Update local message state to reflect read status
        setMessages(prev => 
          prev.map(msg => 
            unreadIds.includes(msg.id) ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
    }
  }, [userId]);

  // Count unread messages from admin
  const countUnreadMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact' })
        .eq('receiver_id', userId)
        .eq('is_admin_message', true)
        .eq('read', false);
        
      if (error) throw error;
      
      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
    }
  }, [userId]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId},receiver_id.is.null`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
        // Mark admin messages as read when the chat is opened
        await markAdminMessagesAsRead();
      } else {
        // Message par défaut si aucun message dans la base de données
        sendAdminMessage("Bonjour ! Comment puis-je vous aider ?");
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, markAdminMessagesAsRead]);

  const subscribeToMessages = useCallback(() => {
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
          
          // Vérifier si le message est destiné à cet utilisateur ou est un message admin
          if (
            newMessage.sender_id === userId || 
            newMessage.receiver_id === userId || 
            newMessage.receiver_id === null
          ) {
            setMessages((current) => [...current, newMessage]);
            
            // Si c'est un message de l'admin, le marquer comme lu automatiquement
            // puisque l'utilisateur est actuellement dans le chat
            if (newMessage.is_admin_message && newMessage.receiver_id === userId) {
              markAdminMessagesAsRead();
            } else {
              // Update unread count
              countUnreadMessages();
            }
          }
        }
      )
      .subscribe();

    return channel;
  }, [userId, markAdminMessagesAsRead, countUnreadMessages]);

  // Check for unread messages on mount and periodically
  useEffect(() => {
    countUnreadMessages();
    
    // Check every 30 seconds for new unread messages
    const interval = setInterval(() => {
      countUnreadMessages();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [countUnreadMessages]);

  const sendAdminMessage = async (text: string) => {
    try {
      const { error } = await supabase.from('chat_messages').insert({
        message: text,
        sender_id: null, // Changed from userId to null to represent system message
        is_admin_message: true,
        receiver_id: userId, // Message destiné à l'utilisateur
        read: true, // Auto-read for first message
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message administrateur:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return false;
    
    try {
      // Ajouter message de l'utilisateur à la base de données
      const { error } = await supabase.from('chat_messages').insert({
        message: message.trim(),
        sender_id: userId,
        receiver_id: null, // Message pour tous les admins
        read: false, // Make sure it's marked as unread for admins
      });

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    messages,
    isLoading,
    unreadCount,
    fetchMessages,
    subscribeToMessages,
    sendMessage,
    markAdminMessagesAsRead
  };
};
