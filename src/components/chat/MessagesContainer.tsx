
import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from './types';
import { ChatMessage } from './ChatMessage';

interface MessagesContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  userId: string;
  formatDate: (dateString: string) => string;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({ 
  messages, 
  isLoading, 
  userId,
  formatDate 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Défiler automatiquement vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Chargement des messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="text-center py-4 text-gray-500">Aucun message</div>;
  }

  return (
    <div className="flex-1 p-3 h-96 overflow-y-auto flex flex-col space-y-3">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isCurrentUser={userId}
          formatDate={formatDate}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
