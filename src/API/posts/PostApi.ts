import { Post } from "../../types/post";
import { api } from "../APIHandler";

export async function getPosts(pageNo: number, category: string = "") {
  try {
    const categoryPath = category === "All" ? "" : `/category/${category}`;
    const [noticeResponse, postResponse] = await Promise.all([
      api.get(`/community/category/notice`),
      api.get(`/community${categoryPath}?page=${pageNo - 1}`),
    ]);
    const notices = noticeResponse.data.posts.map((noticePost: Post) => ({
      ...noticePost,
    }));
    const posts = postResponse.data.posts.map((post: Post) => ({
      ...post,
    }));
    const totalPostCount = postResponse.data.totalPostCount;
    return {notices, posts, totalPostCount};
  } catch (error) {
    console.error("Error fetching posts: " + error);
    throw error;
  }
}
