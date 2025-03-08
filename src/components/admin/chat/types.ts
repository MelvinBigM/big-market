
export type ChatMessage = {
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

export type Conversation = {
  user_id: string;
  user_name: string | null;
  last_message: string;
  last_message_date: string;
  unread_count: number;
};
