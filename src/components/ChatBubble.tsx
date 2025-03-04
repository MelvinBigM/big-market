
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';

// Type pour les messages de chat
type ChatMessage = {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string | null;
  is_admin_message: boolean;
  created_at: string;
};

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Si l'utilisateur n'est pas authentifié, ne pas afficher la bulle de chat
  if (!session) return null;

  const userId = session.user.id;

  // Charger les messages au chargement du composant
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const subscription = subscribeToMessages();
      
      // Nettoyer l'abonnement quand le composant se démonte
      return () => {
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      };
    }
  }, [isOpen]);

  // Défiler automatiquement vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const toggleChat = () => {
    setIsOpen(!isOpen);
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      // Ajouter message de l'utilisateur à la base de données
      const { error } = await supabase.from('chat_messages').insert({
        message: message.trim(),
        sender_id: userId,
        receiver_id: null, // Message pour tous les admins
      });

      if (error) throw error;
      
      // Effacer l'input
      setMessage('');
      
      // Simuler réponse après un court délai
      setTimeout(async () => {
        await sendAdminMessage("Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.");
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
          <div className="bg-primary p-3 text-white flex justify-between items-center">
            <h3 className="font-medium">Chat en direct</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-3 h-96 overflow-y-auto flex flex-col space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Chargement des messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-4 text-gray-500">Aucun message</div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`max-w-[80%] p-3 rounded-lg flex flex-col ${
                    msg.sender_id === userId && !msg.is_admin_message
                      ? 'bg-primary text-white self-end rounded-br-none'
                      : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
                  }`}
                >
                  <div>{msg.message}</div>
                  <div className={`text-xs mt-1 ${
                    msg.sender_id === userId && !msg.is_admin_message 
                      ? 'text-primary-foreground/70' 
                      : 'text-gray-500'
                  }`}>
                    {formatDate(msg.created_at)}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-gray-200 p-3 flex items-center">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Écrivez votre message..."
              className="flex-1 min-h-10 max-h-32 resize-none"
            />
            <button 
              onClick={handleSendMessage}
              className="ml-2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim() || isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};

export default ChatBubble;
