export interface Post {
  post_id: number;
  post_category: string;
  post_title: string;
  post_content: string;
  post_comments: number;
  post_likes: number;
  post_author: string;
  post_time: string;
  liked: boolean;
  updated: boolean;
  reported: boolean;
};

export type CategoryKey = "All" | "공지" | "자유" | "질문" | "중고거래" | "구인";