import { Card, Form } from "react-bootstrap";
import { Reply } from "../../../../types/reply";
import ReplyHeader from "./components/ReplyHeader";
import ReplyContent from "./components/ReplyContent";
import { Comment } from "../../../../types/comment";
import ReplyBottom from "./components/ReplyBottom";
import { useState } from "react";
import { apiPut } from "../../../API/APIHandler";

interface ReplyListItemProps {
  reply: Reply;
  backgroundColor: string;
  replyAuthor: string;
  isCommentUpdate: boolean;
  setIsCommentUpdate: (newValue: boolean) => void;
  updateComment: Comment | null;
  setUpdateComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  requestLikeComment: () => void;
};

const ReplyListItem = (props: ReplyListItemProps) => {
  const [hasRequestReplyUpdate, setHasRequestReplyUpdate] = useState(false);

  const requestUpdateComment = async () => {
    if (hasRequestReplyUpdate)
      return;
      setHasRequestReplyUpdate(true);
    try {
      const isUpdate = window.confirm("답글을 수정할까요?");
      if (!isUpdate) return;
      const response = await apiPut(`/comments/${props.reply.reply_id}`, {
        content: props.updateComment?.comment_content,
      });

      if (response.data) {
        alert("댓글을 수정했습니다!");
        window.location.reload();
      }
      setHasRequestReplyUpdate(false);
    } catch (error) {
      console.error("Error like comment:", error);
      setHasRequestReplyUpdate(false);
    }
  };

  return <Card
    key={props.reply.reply_id}
    className="comment"
    style={{ marginLeft: "10%" }}
    >
      <span style={{
        width: "10px",
        height: "10px",
        borderBottom: "2px solid black",
        borderLeft: "2px solid black",
        position: "absolute",
        left: "-15px",
        top: "10px"
      }}></span>
  
      <ReplyHeader
        backgroundColor={props.backgroundColor}
        author={props.replyAuthor}
        updated={props.reply.updated}
        replyTime={props.reply.reply_time}
      />

      <Card.Body
        className="cardBody"
        style={{ paddingBottom: "5px" }}
      >
        {props.isCommentUpdate &&
        props.updateComment != null &&
        props.reply.reply_id === props.updateComment.comment_id ? (
          <div>
            <Form.Control
              className="send"
              as="textarea"
              value={props.updateComment.comment_content}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  props.setUpdateComment((prevState) => {
                    if (prevState == null)
                      return null;
                    return {
                      ...prevState,
                      comment_content: e.target.value,
                    };
                  });
                }
              }}
              placeholder="답글을 작성해주세요 (200자 이내)"
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
        ) : (
          <ReplyContent
            reply={props.reply}
          />
        )}
      </Card.Body>
      <ReplyBottom
        reply={props.reply}
        isCommentUpdate={props.isCommentUpdate}
        setIsCommentUpdate={props.setIsCommentUpdate}
        updateComment={props.updateComment}
        setUpdateComment={props.setUpdateComment}
        requestLikeComment={props.requestLikeComment}
      />
  </Card>
};

export default ReplyListItem;