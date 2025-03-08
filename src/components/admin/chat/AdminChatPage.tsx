
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import NavBar from "../../NavBar";
import Footer from "../../Footer";
import { useChatAdmin } from "./hooks/useChatAdmin";
import ConversationsList from "./ConversationsList";
import ChatMessageArea from "./ChatMessageArea";
import { useEffect } from "react";

const AdminChatPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    conversations,
    messages,
    selectedUserId,
    isLoadingConversations,
    setSelectedUserId,
    sendMessage,
    formatDate,
    loadConversations,
    markMessagesAsRead,
  } = useChatAdmin(profile);

  // Force refresh conversations when component mounts to ensure we have latest read status
  useEffect(() => {
    if (profile) {
      // Load conversations when component mounts and periodically refresh
      loadConversations();
      
      // Set up a periodic refresh every 30 seconds
      const intervalId = setInterval(() => {
        if (profile) {
          loadConversations();
          // If a conversation is selected, mark its messages as read again
          if (selectedUserId) {
            markMessagesAsRead(selectedUserId);
          }
        }
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [profile, selectedUserId]);

  // Redirect non-admin users
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
    navigate('/');
    toast.error("Accès non autorisé");
    return null;
  }

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    // Immediately mark messages as read when a conversation is selected
    markMessagesAsRead(userId);
  };

  const handleSendReply = (message: string) => {
    sendMessage(message);
  };

  const selectedConversation = conversations.find(c => c.user_id === selectedUserId);

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
            <ConversationsList
              conversations={conversations}
              isLoading={isLoadingConversations}
              selectedUserId={selectedUserId}
              onSelectConversation={handleSelectConversation}
            />

            {/* Zone principale - Messages */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col h-[600px]">
              <ChatMessageArea
                selectedUserId={selectedUserId}
                messages={messages}
                profile={profile}
                selectedUserName={selectedConversation?.user_name || null}
                formatDate={formatDate}
                onSendMessage={handleSendReply}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminChatPage;
