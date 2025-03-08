
import { useState } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 flex items-end">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Écrivez votre réponse..."
        className="flex-1 min-h-10 max-h-32 resize-none"
      />
      <Button
        onClick={handleSend}
        className="ml-2 p-2 rounded-full h-10 w-10"
        disabled={!message.trim()}
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default MessageInput;
