import { Reply } from "./reply";

export interface Comment {
  comment_id: number;
  comment_content: string;
  comment_author: string;
  comment_likes: number;
  comment_time: string;
  liked: boolean;
  replies: Reply[];
  updated: boolean;
  reported: boolean;
}