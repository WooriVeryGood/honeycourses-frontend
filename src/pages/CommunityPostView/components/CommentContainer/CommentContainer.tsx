import { Comment } from "../../../../types/comment";
import CommentInput from "../CommentInput/CommentInput";

import styles from './CommentContainer.module.css';

interface CommentContainerProps {
  postId: string | undefined;
  comments: Comment[];
}

const CommentContainer = (props: CommentContainerProps) => {
  var count = 0;
  props.comments.forEach((comment) => {
    count++
    comment.replies.forEach((reply) => count++);
  });
  return <>
    <div className={styles.commentCount}>
      <img
        src="/images/comments.svg"
        alt="comments-icon"
        style={{
          marginLeft: "10px",
          marginRight: "5px",
          width: "15px",
          height: "15px",
        }}
      />
      <span> 댓글 {count} 개</span>
    </div>

    <CommentInput
      postId={props.postId}
    />
  </>
};

export default CommentContainer;