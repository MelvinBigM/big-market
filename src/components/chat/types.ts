
export type ChatMessage = {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string | null;
  is_admin_message: boolean;
  created_at: string;
};
