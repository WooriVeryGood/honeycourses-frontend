import { Comment } from "../../../../types/comment";
import CommentInput from "../CommentInput";
import CommentList from "../CommentList";

import "./styles.css";

interface CommentContainerProps {
  postId: string | undefined;
  comments: Comment[];
  commentCounts: number;
}

const CommentContainer = (props: CommentContainerProps) => {

  return <>
    <div className="commentCount">
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
      <span> 댓글 {props.commentCounts} 개</span>
    </div>

    <CommentInput
      postId={props.postId}
    />
  </>
};

export default CommentContainer;