
import { useRef, useEffect } from "react";
import { ChatMessage } from "./types";
import { Profile } from "@/lib/types";

interface MessagesListProps {
  messages: ChatMessage[];
  profile: Profile;
  formatDate: (dateString: string) => string;
}

const MessagesList = ({ messages, profile, formatDate }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun message dans cette conversation
      </div>
    );
  }

  return (
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
  );
};

export default MessagesList;
