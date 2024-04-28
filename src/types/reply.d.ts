export interface Reply {
  reply_id: number;
  reply_content: string;
  reply_author?: string;
  member_id: number;
  reply_likes: number;
  reply_time: string;
  liked: boolean;
  updated: boolean;
  reported: boolean;
}