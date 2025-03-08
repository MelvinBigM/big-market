
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Conversation } from "./types";

interface ConversationsListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedUserId: string | null;
  onSelectConversation: (userId: string) => void;
}

const ConversationsList = ({
  conversations,
  isLoading,
  selectedUserId,
  onSelectConversation,
}: ConversationsListProps) => {
  // Add local state to track which conversations have been viewed this session
  const [viewedConversations, setViewedConversations] = useState<Set<string>>(new Set());

  // When a conversation is selected, add it to viewed conversations
  const handleSelectConversation = (userId: string) => {
    setViewedConversations(prev => new Set(prev).add(userId));
    onSelectConversation(userId);
  };

  return (
    <div className="md:col-span-1 border-r border-gray-200">
      <div className="py-4 px-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium">Conversations</h2>
      </div>
      <div className="overflow-y-auto h-[600px]">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune conversation
          </div>
        ) : (
          conversations.map((conversation) => (
            <motion.div
              key={conversation.user_id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedUserId === conversation.user_id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectConversation(conversation.user_id)}
              whileHover={{ x: 2 }}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {conversation.user_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium truncate">
                      {conversation.user_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.last_message_date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conversation.last_message}</p>
                </div>
                {conversation.unread_count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
