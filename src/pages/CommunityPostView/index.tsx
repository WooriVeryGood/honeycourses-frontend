import React, { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../API/APIHandler";
import { Post } from "../../types/post";
import { Comment } from "../../types/comment";
import PostContainer from "./components/PostContainer";
import CommentContainer from "./components/CommentContainer";
import CommentList from "./components/CommentList";

import "./styles.css";

export default function CommunityPostView() {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const postId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setIsLoading(true);
        Promise.all([
          apiGet(`/posts/${postId}`),
          apiGet(`/posts/${postId}/comments`),
        ])
        .then(([postData, commentData]) => {
          setPost(postData.data);
          setComments(commentData.data.comments);
          setIsLoading(false);
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          if (
            error.response.data.message === "게시물을 찾을 수 없습니다." &&
            error.response.status === 404
          ) {
            navigate("/community");
            alert("존재하지 않는 게시글입니다.");
          }
          console.error("Error fetching post and comments:", error);
        });
      } catch (error) {
        console.error("Error in fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchPostAndComments();
  }, [postId]);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className="communityPostViewContainer">
        {post && (
          <PostContainer
            post={post}
            setPost={setPost}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        <div className="comment-section">
          <CommentContainer
            postId={postId}
            comments={comments}
          />

          {post && (
            <CommentList
              postAuthor={post.member_id}
              comments={comments}
              setComments={setComments}
            />
          )}

        </div>
      </Container>
    </PageView>
  );
}
