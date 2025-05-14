export interface Comment {
  id: string;
  user_id: string;
  content: string;
  is_read: boolean;
  created_at: string; // Use the exact key as in your backend
}