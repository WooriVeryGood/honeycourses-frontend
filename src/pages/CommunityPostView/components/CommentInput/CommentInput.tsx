import { useState } from "react";
import { apiPost } from "../../../../API/APIHandler";
import WGTextInput from "../../../../components/WGTextInput/WGTextInput";

import styles from './CommentInput.module.css';

interface CommentInputProps {
  postId: string | undefined;
}

const CommentInput = (props: CommentInputProps) => {
  const [newComment, setNewComment] = useState("");
  const [hasRequestPostComment, setHasRequestPostComment] = useState(false);

  const requestCommentPost = async () => {
    if (hasRequestPostComment)
      return;
      setHasRequestPostComment(true);
    try {
      const data = { content: newComment };
      await apiPost(`/community/${props.postId}/comments`, data).then((response) => {
        if (response.data) {
          alert("댓글 작성에 성공했습니다!");
          window.location.reload();
        } else {
          console.error("Error in response after posting comment.");
        }
      });
      setHasRequestPostComment(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      setHasRequestPostComment(false);
    }
  };

  return <div className={styles.comment_input_group}>
    <WGTextInput
      textarea="textarea"
      text={newComment}
      onTextChange={setNewComment}
      placeholder="댓글을 작성해주세요 (200자 이내)"
      className={styles.send}
    />

    <div
      onClick={requestCommentPost}
      style={{ margin: "5px 5px", cursor: "pointer" }}
    >
      <img
        src="/images/send.png"
        alt="send-icon"
        style={{
          width: "30px",
          height: "30px",
        }}
      />
    </div>
  </div>
};

export default CommentInput;