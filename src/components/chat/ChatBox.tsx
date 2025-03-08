
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage as MessageType } from './types';
import ChatInput from './ChatInput';
import MessagesContainer from './MessagesContainer';

interface ChatBoxProps {
  onClose: () => void;
  messages: MessageType[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<boolean>;
  userId: string;
}

const ChatBox = ({ onClose, messages, isLoading, sendMessage, userId }: ChatBoxProps) => {
  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-primary text-white rounded-t-lg">
        <h3 className="font-medium">Support Chat</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-8 w-8 rounded-full text-white hover:bg-primary-foreground/20"
        >
          <X size={16} />
        </Button>
      </div>
      
      {/* Messages area */}
      <MessagesContainer 
        messages={messages} 
        isLoading={isLoading} 
        userId={userId}
      />
      
      {/* Input area */}
      <div className="p-3 border-t mt-auto">
        <ChatInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatBox;
