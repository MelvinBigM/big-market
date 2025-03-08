
import { MessageCircle } from "lucide-react";
import { ChatMessage } from "./types";
import { Profile } from "@/lib/types";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";

interface ChatMessageAreaProps {
  selectedUserId: string | null;
  messages: ChatMessage[];
  profile: Profile;
  selectedUserName: string | null;
  formatDate: (dateString: string) => string;
  onSendMessage: (message: string) => void;
}

const ChatMessageArea = ({
  selectedUserId,
  messages,
  profile,
  selectedUserName,
  formatDate,
  onSendMessage
}: ChatMessageAreaProps) => {
  if (!selectedUserId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* En-tête du chat */}
      <div className="py-3 px-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium">
          {selectedUserName || 'Conversation'}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <MessagesList 
          messages={messages}
          profile={profile}
          formatDate={formatDate}
        />
      </div>

      {/* Zone de saisie de réponse */}
      <MessageInput onSendMessage={onSendMessage} />
    </>
  );
};

export default ChatMessageArea;
