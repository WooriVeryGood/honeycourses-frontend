import { Card } from "react-bootstrap";
import { Comment } from "../../../../../types/comment";
import Linkify from "linkify-react";

interface CommentContentProps {
  comment: Comment;
}

const urlOptions = {
  target: "_blank",
};

const CommentContent = (props: CommentContentProps) => {
  return (
    <Card.Text>
      {props.comment.reported ? (
        <em style={{ opacity: 0.7 }}>[신고 누적으로 삭제된 댓글입니다.]</em>
      ) : props.comment.comment_content === null ? (
        <em style={{ opacity: 0.7 }}>[삭제된 댓글입니다.]</em>
      ) : (
        <Linkify options={urlOptions}>{props.comment.comment_content}</Linkify>
      )}
    </Card.Text>
  );
};

export default CommentContent;
