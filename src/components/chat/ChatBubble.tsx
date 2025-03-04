
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { MessagesContainer } from './MessagesContainer';
import { ChatInput } from './ChatInput';
import { useChatMessages } from './useChatMessages';
import { supabase } from '@/integrations/supabase/client';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useAuth();
  
  // Si l'utilisateur n'est pas authentifié, ne pas afficher la bulle de chat
  if (!session) return null;

  const userId = session.user.id;
  const { messages, isLoading, fetchMessages, subscribeToMessages, sendMessage } = useChatMessages(userId);

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

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
          
          <MessagesContainer
            messages={messages}
            isLoading={isLoading}
            userId={userId}
            formatDate={formatDate}
          />
          
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
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
