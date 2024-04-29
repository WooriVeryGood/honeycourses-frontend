export interface Reply {
  reply_id: number;
  reply_content: string;
  member_id: number;
  reply_like_count: number;
  reply_time: string;
  liked: boolean;
  updated: boolean;
  reported: boolean;
  member_id: number;
  mine: boolean;
}