
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type pour les messages de chat
type ChatMessage = {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string | null;
  is_admin_message: boolean;
  created_at: string;
  read: boolean;
  profile?: {
    full_name: string | null;
  };
};

// Type pour les conversations
type Conversation = {
  user_id: string;
  user_name: string | null;
  last_message: string;
  last_message_date: string;
  unread_count: number;
};

const AdminChatPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
      toast.error("Accès non autorisé");
    } else if (!isLoading && profile) {
      loadConversations();
      // Subscribe to new messages
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
            // Update conversations list
            loadConversations();
            // Update messages if the conversation is currently selected
            if (selectedUserId && (newMessage.sender_id === selectedUserId || newMessage.receiver_id === selectedUserId)) {
              setMessages((prev) => [...prev, newMessage]);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_messages',
          },
          () => {
            // Recharger les conversations pour mettre à jour les compteurs de messages non lus
            loadConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile, isLoading, selectedUserId, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load messages when user is selected
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      // Get all users who have sent messages
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          sender_id,
          message,
          created_at,
          read,
          profile:profiles!chat_messages_sender_id_fkey(full_name)
        `)
        .eq('is_admin_message', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to get unique conversations
      const conversationsMap = new Map<string, Conversation>();

      data?.forEach((msg) => {
        if (!conversationsMap.has(msg.sender_id)) {
          conversationsMap.set(msg.sender_id, {
            user_id: msg.sender_id,
            user_name: msg.profile?.full_name || 'Utilisateur',
            last_message: msg.message,
            last_message_date: msg.created_at,
            unread_count: msg.read ? 0 : 1,
          });
        } else if (!msg.read) {
          const conv = conversationsMap.get(msg.sender_id)!;
          conv.unread_count++;
          conversationsMap.set(msg.sender_id, conv);
        }
      });

      // Convert map to array and sort by date
      const sortedConversations = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime());

      setConversations(sortedConversations);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      toast.error("Impossible de charger les conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      // Get messages between admin and selected user
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data as ChatMessage[]);
        
        // Mark messages as read
        const unreadMessages = data
          .filter(msg => !msg.read && msg.sender_id === userId)
          .map(msg => msg.id);
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('chat_messages')
            .update({ read: true })
            .in('id', unreadMessages);
          
          // Mettre à jour localement le nombre de messages non lus dans la conversation sélectionnée
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.user_id === userId 
                ? { ...conv, unread_count: 0 } 
                : conv
            )
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error("Impossible de charger les messages");
    }
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedUserId || !profile) return;

    try {
      const { error } = await supabase.from('chat_messages').insert({
        message: replyMessage.trim(),
        sender_id: profile.id,
        receiver_id: selectedUserId,
        is_admin_message: true,
      });

      if (error) throw error;

      setReplyMessage("");
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      toast.error("Impossible d'envoyer votre réponse");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des conversations
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* Sidebar - Liste des conversations */}
            <div className="md:col-span-1 border-r border-gray-200">
              <div className="py-4 px-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium">Conversations</h2>
              </div>
              <div className="overflow-y-auto h-[600px]">
                {isLoadingConversations ? (
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

            {/* Zone principale - Messages */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col h-[600px]">
              {selectedUserId ? (
                <>
                  {/* En-tête du chat */}
                  <div className="py-3 px-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-medium">
                      {conversations.find(c => c.user_id === selectedUserId)?.user_name || 'Conversation'}
                    </h2>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Aucun message dans cette conversation
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.sender_id === profile.id
                                ? 'bg-primary text-white ml-auto rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <div>{msg.message}</div>
                            <div className={`text-xs mt-1 ${
                              msg.sender_id === profile.id ? 'text-primary-foreground/70' : 'text-gray-500'
                            }`}>
                              {formatDate(msg.created_at)}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Zone de saisie de réponse */}
                  <div className="p-3 border-t border-gray-200 flex items-end">
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Écrivez votre réponse..."
                      className="flex-1 min-h-10 max-h-32 resize-none"
                    />
                    <Button
                      onClick={handleSendReply}
                      className="ml-2 p-2 rounded-full h-10 w-10"
                      disabled={!replyMessage.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminChatPage;
