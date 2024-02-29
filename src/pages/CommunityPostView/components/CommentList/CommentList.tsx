import { Card } from "react-bootstrap";
import { Comment } from "../../../../types/comment";
import WGTextInput from "../../../../components/WGTextInput/WGTextInput";
import { useState } from "react";
import { COMMENT_BACK_COLORS } from "../../../../constants/colors";
import { RANDOM_NICKNAMES } from "../../../../constants/nicknames";
import CommentListItem from "../CommentListItem/CommentListItem";
import { apiPost, apiPut } from "../../../../API/APIHandler";

import styles from './CommentList.module.css';

interface CommentListProps {
  postAuthor: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentList = (props: CommentListProps) => {
  const [newReply, setNewReply] = useState("");
  const [isCommentUpdate, setIsCommentUpdate] = useState(false);
  const [isWritingReply, setIsWritingReply] = useState(false);
  const [updateComment, setUpdateComment] = useState<Comment | null>(null);
  const [hasRequestPostReply, setHasRequestPostReply] = useState(false);
  const [writeReplyToggle, setWriteReplyToggle] = useState<boolean[]>(
    Array(props.comments.length).fill(false)
  );

  const getCommentBackgroundColor = (
    commentAuthor: string,
    postAuthor: string
  ): string => {
    if (commentAuthor === postAuthor)
      return "white";
    const allAuthors = getAllAuthors(props.comments);
    const authorPosition = allAuthors.indexOf(commentAuthor);
    if (authorPosition === -1)
      return "white";
    return COMMENT_BACK_COLORS[authorPosition % COMMENT_BACK_COLORS.length];
  };

  const getAllAuthors = (comments: Comment[]): string[] => {
    const authors = new Set<string>();

    comments.forEach((comment) => {
      if (comment.comment_author !== props.postAuthor) {
        authors.add(comment.comment_author);
      }
      comment.replies.forEach((reply) => {
        if (reply.reply_author !== props.postAuthor) {
          authors.add(reply.reply_author);
        }
      });
    });

    return Array.from(authors);
  };

  const allCommentAuthors = getAllAuthors(props.comments);

  const getAuthorName = (author: string): string => {
    if (author === props.postAuthor)
      return "작성자";

    const allAuthors = getAllAuthors(props.comments);
    const authorPosition = allAuthors.indexOf(author);
    if (authorPosition === -1)
      return "Unknown";

    return RANDOM_NICKNAMES[authorPosition % RANDOM_NICKNAMES.length];
  };

  const handlePostReply = async (commentId: number) => {
    if (hasRequestPostReply)
      return;
    setHasRequestPostReply(true);
    try {
      const response = await apiPost(`/comments/${commentId}/reply`, {
        content: newReply,
      });

      if (response.status === 201) {
        alert("답글 작성에 성공했습니다!");
        window.location.reload();
      } else {
        console.error("Error in response after posting reply.");
      }
      setHasRequestPostReply(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      setHasRequestPostReply(false);
    }
  };

  const requestLikeComment = async (commentId: number) => {
    try {
      const response = await apiPut(`/comments/${commentId}/like`, null);
      if (response.data) {
        const liked = response.data.liked;

        props.setComments(
          props.comments.map((comment) => {
            if (comment.comment_id === commentId) {
              return {
                ...comment,
                comment_likes: response.data.like_count,
                liked: response.data.liked,
              };
            }
            const replies = comment.replies.map((reply) =>
              reply.reply_id === commentId
                ? {
                    ...reply,
                    reply_likes: response.data.like_count,
                    liked: response.data.liked,
                  }
                : reply
            );
            return { ...comment, replies };
          })
        );

        alert(`댓글${liked ? "을 추천" : " 추천을 취소"}했습니다!`);
      }
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  return <div style={{ width: "100%", alignItems: "start" }}>
    {props.comments.map((comment, index) => (
      <Card key={comment.comment_id} className={styles.comment}>
        <CommentListItem
          comment={comment}
          commentAuthor={getAuthorName(comment.comment_author)}
          backgroundColor={getCommentBackgroundColor(
            comment.comment_author,
            props.postAuthor
          )}
          isCommentUpdate={isCommentUpdate}
          setIsCommentUpdate={setIsCommentUpdate}
          updateComment={updateComment}
          setUpdateComment={setUpdateComment}
          postAuthor={props.postAuthor}
          commentAuthors={allCommentAuthors}
          onClickWriteReplyButton={() => {
            setIsWritingReply(true);
            const updatedToggles = [...writeReplyToggle];
            updatedToggles[index] = !updatedToggles[index];
            setWriteReplyToggle(updatedToggles);
          }}
          isWritingReply={isWritingReply}
          requestLikeComment={requestLikeComment}
        />
        <div>
          {writeReplyToggle[index] ? (
            <div style={{ marginTop: "8px" }}>
              <WGTextInput
                textarea="textarea"
                className={styles.send}
                text={newReply}
                onTextChange={setNewReply}
                placeholder="답글을 작성해주세요 (200자 이내)"
              />
              <span
                style={{
                  marginRight: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "gray",
                }}
                onClick={() => handlePostReply(comment.comment_id)}
              >
                제출
              </span>
              <span
                style={{
                  marginRight: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "gray",
                }}
                onClick={() => {
                  const updatedToggles = [...writeReplyToggle];
                  updatedToggles[index] = !updatedToggles[index];
                  setWriteReplyToggle(updatedToggles);
                  setIsWritingReply(false);
                }}
              >
                취소
              </span>
            </div>
          ) : null}
        </div>
      </Card>
    ))}
  </div>
};

export default CommentList;