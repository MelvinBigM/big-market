
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBox from './ChatBox';
import { useChatMessages } from './useChatMessages';
import { supabase } from '@/integrations/supabase/client';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuth();
  
  // Only create chat if there's a user profile
  const chat = profile ? useChatMessages(profile.id) : null;
  
  useEffect(() => {
    if (chat) {
      // Initialize unread count on mount
      chat.countUnreadMessages();
      
      // If chat is open, fetch messages and mark as read
      if (isOpen) {
        chat.fetchMessages();
        chat.markAdminMessagesAsRead();
        
        // Set up real-time updates
        const channel = chat.subscribeToMessages();
        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [isOpen, chat]);

  if (!profile) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          className="bg-primary text-white p-3 rounded-full shadow-lg relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle size={24} />
          
          {/* Notification badge for unread messages */}
          {!isOpen && chat?.unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {chat.unreadCount}
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && chat && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-80 md:w-96 bg-white rounded-lg shadow-xl"
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          >
            <ChatBox 
              onClose={() => setIsOpen(false)}
              messages={chat.messages}
              isLoading={chat.isLoading}
              sendMessage={chat.sendMessage}
              userId={profile.id}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBubble;
