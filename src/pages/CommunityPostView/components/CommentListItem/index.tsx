import { Card, Form } from "react-bootstrap";
import { Comment } from "../../../../types/comment";
import CommentHeader from "./components/CommentHeader";

import CommentContent from "./components/CommentContent";
import CommentBottom from "./components/CommentBottom";
import { useState } from "react";
import { apiPut } from "../../../API/APIHandler";
import ReplyList from "../ReplyList/ReplyList";

import "./styles.css";

interface CommentListItemProps {
  postAuthor: string;
  commentAuthors: string[];
  comment: Comment;
  backgroundColor: string;
  commentAuthor: string;
  isWritingReply: boolean;
  isCommentUpdate: boolean;
  setIsCommentUpdate: (newValue: boolean) => void;
  updateComment: Comment | null;
  setUpdateComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  onClickWriteReplyButton: () => void;
  requestLikeComment: (commentId: number) => void;
}

const CommentListItem = (props: CommentListItemProps) => {
  const [hasRequestCommentUpdate, setHasRequestCommentUpdate] = useState(false);

  const requestUpdateComment = async () => {
    if (hasRequestCommentUpdate)
      return;
      setHasRequestCommentUpdate(true);
    try {
      const isUpdate = window.confirm("댓글을 수정할까요?");
      if (!isUpdate) return;
      const response = await apiPut(`/comments/${props.comment.comment_id}`, {
        content: props.updateComment?.comment_content,
      });

      if (response.data) {
        alert("댓글을 수정했습니다!");
        window.location.reload();
      }
      setHasRequestCommentUpdate(false);
    } catch (error) {
      console.error("Error like comment:", error);
      setHasRequestCommentUpdate(false);
    }
  };

  return <>
    <CommentHeader
      backgroundColor={props.backgroundColor}
      author={props.commentAuthor}
      updated={props.comment.updated}
      commentTime={props.comment.comment_time}
    />
    
    <Card.Body
      className="cardBody"
      style={{ paddingBottom: "5px" }}
    >
      {props.isCommentUpdate &&
      props.updateComment != null &&
      props.comment.comment_id == props.updateComment.comment_id ? (
        <div>
          <Form.Control
            className="send"
            as="textarea"
            value={props.updateComment.comment_content}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                props.setUpdateComment((prevState) => {
                  if (prevState == null) return null;
                  return {
                    ...prevState,
                    comment_content: e.target.value,
                  };
                });
              }
            }}
            placeholder="댓글을 작성해주세요 (200자 이내)"
            style={{
              marginRight: "10px",
              flexGrow: 1,
              height: "40px",
            }}
            required
          />
          <span
            style={{
              marginRight: "8px",
              cursor: "pointer",
              fontSize: "14px",
              color: "gray",
            }}
            onClick={requestUpdateComment}
          >
            수정
          </span>
          <span
            style={{
              cursor: "pointer",
              fontSize: "14px",
              color: "gray",
            }}
            onClick={() => props.setIsCommentUpdate(false)}
          >
            취소
          </span>
        </div>
      ) : <CommentContent comment={props.comment} />
      }
    </Card.Body>

    <CommentBottom
      comment={props.comment}
      isCommentUpdate={props.isCommentUpdate}
      setIsCommentUpdate={props.setIsCommentUpdate}
      updateComment={props.updateComment}
      setUpdateComment={props.setUpdateComment}
      onClickWriteReplyButton={props.onClickWriteReplyButton}
      isWritingReply={props.isWritingReply}
      requestLikeComment={() => props.requestLikeComment(props.comment.comment_id)}
    />

    <ReplyList
      postAuthor={props.postAuthor}
      replies={props.comment.replies}
      commentAuthors={props.commentAuthors}
      isCommentUpdate={props.isCommentUpdate}
      setIsCommentUpdate={props.setIsCommentUpdate}
      updateComment={props.updateComment}
      setUpdateComment={props.setUpdateComment}
      requestLikeComment={props.requestLikeComment}
    />
  </>;
};

export default CommentListItem;