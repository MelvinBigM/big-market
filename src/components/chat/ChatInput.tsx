
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const success = await onSendMessage(message);
    if (success) {
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
};
