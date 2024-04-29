import { Reply } from "./reply";

export interface Comment {
  comment_id: number;
  comment_content: string;
  post_id: number;
  comment_like_count: number;
  comment_time: string;
  liked: boolean;
  replies: Reply[];
  updated: boolean;
  reported: boolean;
  member_id: number;
  mine?: boolean;
}