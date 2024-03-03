import { useEffect } from "react";
import PageView from "../PageView/PageView";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import PostContainer from "./components/PostContainer/PostContainer";
import CommentContainer from "./components/CommentContainer/CommentContainer";
import CommentList from "./components/CommentList/CommentList";
import styles from "./CommunityPostView.module.css";
import Loader from "../../components/Loader/Loader";
import { useSinglePost } from "../../API/posts/useSinglePost";

export default function CommunityPostView() {
  const postId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const { isLoading, error, post, comments } = useSinglePost(postId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postId]);

  useEffect(() => {
    if (error) {
      navigate("/courses");
    }
  }, [error, navigate]);

  if (!post || !comments || isLoading) {
    return <Loader />;
  }

  return (
    <PageView>
      <Container fluid className={styles.communityPostViewContainer}>
        {post && <PostContainer post={post} />}

        <div className={styles.comment_section}>
          <CommentContainer postId={postId} comments={comments} />

          {post && (
            <CommentList postAuthor={post.post_author} comments={comments} />
          )}
        </div>
      </Container>
    </PageView>
  );
}
