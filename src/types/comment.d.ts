import { Reply } from "./reply";

export interface Comment {
  comment_id: number;
  comment_content: string;
  comment_author?: string;
  member_id: number;
  mine?: boolean;
  comment_likes: number;
  comment_time: string;
  liked: boolean;
  replies: Reply[];
  updated: boolean;
  reported: boolean;
}