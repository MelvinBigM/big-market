
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './types';

export const useChatMessages = (userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
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
  };

  const subscribeToMessages = () => {
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
          }
        }
      )
      .subscribe();

    return channel;
  };

  const sendAdminMessage = async (text: string) => {
    try {
      const { error } = await supabase.from('chat_messages').insert({
        message: text,
        sender_id: userId, // Pour respecter la RLS, mais marqué comme admin
        is_admin_message: true,
        receiver_id: userId, // Message destiné à l'utilisateur
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message administrateur:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    try {
      // Ajouter message de l'utilisateur à la base de données
      const { error } = await supabase.from('chat_messages').insert({
        message: message.trim(),
        sender_id: userId,
        receiver_id: null, // Message pour tous les admins
      });

      if (error) throw error;
      
      // Simuler réponse après un court délai
      setTimeout(async () => {
        await sendAdminMessage("Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.");
      }, 1000);
      
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
    fetchMessages,
    subscribeToMessages,
    sendMessage
  };
};
