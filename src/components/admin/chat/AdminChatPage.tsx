
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import NavBar from "../../NavBar";
import Footer from "../../Footer";
import { useChatAdmin } from "./useChatAdmin";
import ConversationsList from "./ConversationsList";
import ChatMessageArea from "./ChatMessageArea";

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
  } = useChatAdmin(profile);

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
