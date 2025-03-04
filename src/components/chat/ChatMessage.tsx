
import React from 'react';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: string;
  formatDate: (dateString: string) => string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser,
  formatDate 
}) => {
  const isUserMessage = message.sender_id === isCurrentUser && message.is_admin_message === false;
  
  return (
    <div 
      className={`max-w-[80%] p-3 rounded-lg flex flex-col ${
        isUserMessage
          ? 'bg-primary text-white self-end rounded-br-none'
          : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
      }`}
    >
      <div>{message.message}</div>
      <div className={`text-xs mt-1 ${
        isUserMessage 
          ? 'text-primary-foreground/70' 
          : 'text-gray-500'
      }`}>
        {formatDate(message.created_at)}
      </div>
    </div>
  );
};
