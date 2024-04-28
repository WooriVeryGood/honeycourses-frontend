export interface Post {
  post_id: number;
  post_category: string;
  post_title: string;
  post_content: string;
  post_comments: number;
  post_likes: number;
  post_author?: string;
  member_id: number;
  mine: boolean;
  post_time: string;
  view_count: number;
  liked: boolean;
  updated: boolean;
  reported: boolean;
};

export type CategoryKey = "All" | "공지" | "자유" | "질문" | "중고거래" | "구인";