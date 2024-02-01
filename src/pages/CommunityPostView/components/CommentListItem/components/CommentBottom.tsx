import { useAuthenticator } from "@aws-amplify/ui-react";
import { Comment } from "../../../../../types/comment";
import { apiDelete, apiPost, apiPut } from "../../../../API/APIHandler";
import { HttpError } from "../../../../../types/error";

interface CommentBottomProps {
  comment: Comment;
  isCommentUpdate: boolean;
  setIsCommentUpdate: (newValue: boolean) => void;
  isWritingReply: boolean;
  updateComment: Comment | null;
  setUpdateComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  onClickWriteReplyButton: () => void;
  requestLikeComment: () => void;
};

const CommentBottom = (props: CommentBottomProps) => {
  const { user } = useAuthenticator((context) => [context.user, context.route]);

  const isMyComment = () => {
    return user.getUsername() === props.comment.comment_author;
  }

  const requestDeleteComment = async () => {
    try {
      const isDelete = window.confirm("댓글을 삭제할까요? (답글이 있는 댓글은 내용만 삭제됩니다)");
      if (!isDelete)
        return;
      const response = await apiDelete(`/comments/${props.comment.comment_id}`);

      if (response.data) {
        alert("댓글을 삭제했습니다!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  const handleCommentReport = async () => {
    const reportMessage = window.prompt("신고 내용을 입력하세요:");
    if (reportMessage === null || reportMessage.trim() === "") {
      alert("신고가 취소되었습니다.");
      return;
    }
    try {
      const response = await apiPost(`/comments/${props.comment.comment_id}/report`, {
        message: reportMessage,
      });
      if (response.status === 201)
        alert("신고가 접수되었습니다.");
    } catch (error) {
      const err = error as HttpError;
      if (err.code === "ERR_BAD_REQUEST")
        alert("이미 신고한 댓글입니다.");
      console.error("Error reporting post:", error);
    }
  };

  const toggleUpdateComment = () => {
    props.setIsCommentUpdate(true);
    props.setUpdateComment((prevState) => {
      if (prevState == null)
        return {
          comment_id: props.comment.comment_id,
          comment_content: props.comment.comment_content,
          comment_author: props.comment.comment_author,
          comment_likes: props.comment.comment_likes,
          comment_time: props.comment.comment_time,
          liked: props.comment.liked,
          replies: props.comment.replies,
          updated: props.comment.updated,
          reported: props.comment.reported,
        };
      return {
        comment_id: props.comment.comment_id,
        comment_content: props.comment.comment_content,
        comment_author: props.comment.comment_author,
        comment_likes: props.comment.comment_likes,
        comment_time: props.comment.comment_time,
        liked: props.comment.liked,
        replies: props.comment.replies,
        updated: props.comment.updated,
        reported: props.comment.reported,
      };
    });
  }

  return <div style={{ display: "flex" }}>
    <div
      style={{
        float: "right",
        marginLeft: "8px",
        cursor: "pointer",
      }}
      onClick={props.requestLikeComment}
    >
      <img
        src={
          props.comment.liked ?
            "/images/likeGreen.svg" :
            "/images/likeWhiteSolidBlack.svg"
        }
        alt="likes-icon"
        style={{
          marginRight: "4px",
          width: "14px",
          height: "14px",
        }}
      />
      <span
        style={
          props.comment.liked ?
          {
            fontSize: "14px",
            color: "green",
            fontWeight: "bolder",
            display: "inline-block",
            margin: 0,
            padding: 0,
          }  :
          {
            fontSize: "14px",
            color: "gray",
            display: "inline-block",
            margin: 0,
            padding: 0,
          }
        }
      >
        추천 {props.comment.comment_likes}
      </span>
    </div>
    <div>
      {isMyComment() &&
      !props.isCommentUpdate &&
      props.comment.comment_content !== null ? (
        <span
          style={{
            marginLeft: "8px",
            cursor: "pointer",
            fontSize: "14px",
            color: "gray",
          }}
          onClick={toggleUpdateComment}
        >
          &nbsp;| &nbsp; 수정&nbsp;
        </span>
      ) : null}
      {isMyComment() && props.comment.comment_content !== null ? (
        <span
          style={{
            marginLeft: "8px",
            cursor: "pointer",
            fontSize: "14px",
            color: "gray",
          }}
          onClick={requestDeleteComment}
        >
          &nbsp;삭제
        </span>
      ) : null}

      {!props.isWritingReply ? 
        <span
        style={{
          marginLeft: "8px",
          cursor: "pointer",
          fontSize: "14px",
          color: "gray",
        }}
        onClick={props.onClickWriteReplyButton}
      >
        &nbsp;| &nbsp; 답글작성
      </span> : null}

      <span
        style={{
          marginLeft: "8px",
          cursor: "pointer",
          fontSize: "14px",
          color: "gray",
        }}
        onClick={handleCommentReport}
      >
        | &nbsp;신고하기
      </span>
    </div>
  </div>
};

export default CommentBottom;