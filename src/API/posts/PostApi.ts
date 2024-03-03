import { AxiosError } from "axios";
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
    return { notices, posts, totalPostCount };
  } catch (error) {
    console.error("Error fetching posts: " + error);
    throw error;
  }
}

export async function getSinglePostAndComment(postId: string | undefined) {
  try {
    const [postData, commentData] = await Promise.all([
      api.get(`/community/${postId}`),
      api.get(`/community/${postId}/comments`),
    ]);
    return { post: postData.data, comments: commentData.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404) {
      alert("존재하지 않는 게시글입니다.");
    }
    console.error("Error fetching post and comments: " + error);
    throw error;
  }
}
