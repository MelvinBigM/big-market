
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: 'Bonjour ! Comment puis-je vous aider ?', isUser: false },
  ]);
  const { toast } = useToast();
  const { session } = useAuth();

  // If user is not authenticated, don't render the chat bubble
  if (!session) return null;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    // Clear input
    setMessage('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.", 
          isUser: false 
        }
      ]);
      
      toast({
        title: "Message envoyé",
        description: "Notre équipe vous répondra bientôt",
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
          
          <div className="flex-1 p-3 max-h-96 overflow-y-auto flex flex-col space-y-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isUser 
                    ? 'bg-primary text-white self-end rounded-br-none'
                    : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-3 flex items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Écrivez votre message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-10 min-h-10 max-h-32"
            />
            <button 
              onClick={handleSendMessage}
              className="ml-2 bg-primary text-white p-2 rounded-full hover:bg-primary/90"
              disabled={!message.trim()}
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
