import { useAuthenticator } from "@aws-amplify/ui-react";
import { Reply } from "../../../../../types/reply";
import { apiDelete, apiPost, apiPut } from "../../../../../API/APIHandler";
import { Comment } from "../../../../../types/comment";
import { HttpError } from "../../../../../types/error";

interface ReplyBottomProps {
  reply: Reply;
  isCommentUpdate: boolean;
  postId: number;
  setIsCommentUpdate: (newValue: boolean) => void;
  updateComment: Comment | null;
  setUpdateComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  requestLikeComment: (replyId: number) => void;
};

const ReplyBottom = (props: ReplyBottomProps) => {
  const { user } = useAuthenticator((context) => [context.user, context.route]);

  const isMyComment = () => {
    return props.reply.mine;
  }

  const toggleUpdateComment = () => {
    props.setIsCommentUpdate(true);
    props.setUpdateComment((prevState) => {
      if (prevState == null)
        return {
          comment_id: props.reply.reply_id,
          comment_content: props.reply.reply_content,
          post_id: props.postId,
          comment_like_count: props.reply.reply_likes,
          comment_time: props.reply.reply_time,
          liked: props.reply.liked,
          member_id: props.reply.member_id,
          replies: [],
          updated: props.reply.updated,
          reported: props.reply.reported,
          mine: props.reply.mine,
        };
      return {
        comment_id: props.reply.reply_id,
        comment_content: props.reply.reply_content,
        post_id: props.postId,
        comment_like_count: props.reply.reply_likes,
        comment_time: props.reply.reply_time,
        liked: props.reply.liked,
        member_id: props.reply.member_id,
        replies: [],
        updated: props.reply.updated,
        reported: props.reply.reported,
        mine: props.reply.mine,
      };
    });
  }

  const requestDeleteComment = async () => {
    try {
      const isDelete = window.confirm("댓글을 삭제할까요? (답글이 있는 댓글은 내용만 삭제됩니다)");
      if (!isDelete)
        return;
      const response = await apiDelete(`/comments/${props.reply.reply_id}`);

      if (response.status === 204) {
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
      const response = await apiPost(`/comments/${props.reply.reply_id}/report`, {
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

  return <div style={{ display: "flex" }}>
    <div
      style={{
        float: "right",
        marginLeft: "8px",
        cursor: "pointer",
      }}
      onClick={() => props.requestLikeComment(props.reply.reply_id)}
    >
      <img
        src={
          props.reply.liked ?
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
          props.reply.liked ?
          {
            fontSize: "14px",
            color: "green",
            fontWeight: "bolder",
          } :
          { 
            fontSize: "14px",
            color: "gray"
          }
        }
      >
        추천 {props.reply.reply_likes}
      </span>
    </div>
    <div>
      {!props.reply.reported &&
      isMyComment() &&
      !props.isCommentUpdate ? (
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
      {!props.reply.reported &&
      isMyComment() ? (
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

export default ReplyBottom;