export interface Reply {
  reply_id: number;
  reply_content: string;
  reply_author: string;
  reply_likes: number;
  reply_time: string;
  liked: boolean;
  updated: boolean;
}