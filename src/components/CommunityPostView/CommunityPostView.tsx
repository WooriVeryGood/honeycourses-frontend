import React, { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Badge from "react-bootstrap/Badge";
import "./CommunityPostView.css";
import styles from "./communityPostView.module.css";
import { useNavigate } from "react-router-dom";
import { apiDelete, apiGet, apiPost, apiPut } from "../API/APIHandler";
import { Post } from "./types/post";
import { Comment } from "./types/comment";
import { Reply } from "./types/reply";
import { commentBackgroundColors } from "./constants/colors";
import { pseudonyms } from "./constants/nicknames";

interface SystemError {
  code: string;
  message: string;
}

export default function CommunityPostView() {
  const { user } = useAuthenticator((context) => [context.user, context.route]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueCommenters, setUniqueCommenters] = useState<string[]>([]);
  const [isCommentUpdate, setIsCommentUpdate] = useState(false);
  const [updateComment, setUpdateComment] = useState<Comment | null>(null);
  const postId = window.location.pathname.split("/").pop();
  const [isPostEdit, setIsPostEdit] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [writeReplyToggle, setWriteReplyToggle] = useState<boolean[]>(
    Array(comments.length).fill(false)
  );
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const navigate = useNavigate();

  const dateA = new Date("2022/06/01 08:00:00");
  const dateB = new Date("2022/06/01 00:00:00");
  const diffMSec = dateA.getTime() - dateB.getTime();

  const getCommentBackgroundColor = (
    commentAuthor: string,
    postAuthor: string
  ): string => {
    if (commentAuthor === postAuthor) return "white";
    const allAuthors = getAllAuthors(comments);
    const authorPosition = allAuthors.indexOf(commentAuthor);
    if (authorPosition === -1) return "white";

    return commentBackgroundColors[
      authorPosition % commentBackgroundColors.length
    ];
  };

  const getAllAuthors = (comments: Comment[]): string[] => {
    const authors = new Set<string>();

    comments.forEach((comment) => {
      if (comment.comment_author !== post?.post_author) {
        authors.add(comment.comment_author);
      }
      comment.replies.forEach((reply) => {
        if (reply.reply_author !== post?.post_author) {
          authors.add(reply.reply_author);
        }
      });
    });

    return Array.from(authors);
  };

  const getAuthorName = (author: string, postAuthor: string): string => {
    if (author === postAuthor) return "작성자";

    const allAuthors = getAllAuthors(comments);
    const authorPosition = allAuthors.indexOf(author);
    if (authorPosition === -1) return "Unknown";

    return pseudonyms[authorPosition % pseudonyms.length];
  };

  const handlePostComment = async () => {
    if (isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const data = {
        content: newComment,
      };
      await apiPost(`/community/${postId}/comments`, data).then((response) => {
        if (response.data) {
          alert("댓글 작성에 성공했습니다!");
          window.location.reload();
        } else {
          console.error("Error in response after posting comment.");
        }
      });
      setIsSubmittingComment(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      setIsSubmittingComment(false);
    }
  };

  const handlePostReport = async (postId: number) => {
    const reportMessage = window.prompt("신고 내용을 입력하세요:");
    if (reportMessage === null || reportMessage.trim() === "") {
      alert("신고가 취소되었습니다.");
      return;
    }
    try {
      const response = await apiPost(`/posts/${postId}/report`, {
        message: reportMessage,
      });
      if (response.status === 201) {
        alert("신고가 접수되었습니다.");
      }
    } catch (error) {
      const err = error as SystemError;
      if (err.code === "ERR_BAD_REQUEST") {
        alert("이미 신고한 게시글입니다.");
      }
      console.error("Error reporting post:", error);
    }
  };

  const handleCommentReport = async (commentId: number) => {
    const reportMessage = window.prompt("신고 내용을 입력하세요:");
    if (reportMessage === null || reportMessage.trim() === "") {
      alert("신고가 취소되었습니다.");
      return;
    }
    try {
      const response = await apiPost(`/comments/${commentId}/report`, {
        message: reportMessage,
      });
      if (response.status === 201) {
        alert("신고가 접수되었습니다.");
      }
    } catch (error) {
      const err = error as SystemError;
      if (err.code === "ERR_BAD_REQUEST") {
        alert("이미 신고한 댓글입니다.");
      }
      console.error("Error reporting post:", error);
    }
  };

  const requestLikePost = async () => {
    try {
      const response = await apiPut(`/community/${postId}/like`, null);
      if (response.data) {
        const liked = response.data.liked;
        if (liked) alert("게시글을 추천했습니다!");
        else alert("게시글 추천을 취소했습니다!");
        if (post !== (undefined || null)) {
          post.liked = liked;
          post.post_likes = response.data.like_count;
          setPost((prevState) => {
            if (prevState === (undefined || null)) return prevState;
            return {
              ...prevState,
              liked: liked,
              post_likes: response.data.like_count,
            };
          });
        }
      }
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  const requestLikeComment = async (commentId: number) => {
    try {
      const response = await apiPut(`/comments/${commentId}/like`, null);
      if (response.data) {
        const liked = response.data.liked;
        if (liked) alert("댓글을 추천했습니다!");
        else alert("댓글 추천을 취소했습니다!");

        setComments(
          comments.map((comment) => {
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
      }
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  const handleEditPost = () => {
    setIsPostEdit(true);
    setEditPostTitle(post?.post_title || "");
    setEditPostContent(post?.post_content || "");
  };

  const submitPostEdit = async () => {
    if (isEditingPost) return;
    setIsEditingPost(true);
    try {
      const response = await apiPut(`/community/${postId}`, {
        post_title: editPostTitle,
        post_content: editPostContent,
      });

      if (response.data) {
        alert("게시글을 수정했습니다!");
        setIsPostEdit(false);
        window.location.reload();
      }
      setIsEditingPost(false);
    } catch (error) {
      console.error("Error updating post:", error);
      setIsEditingPost(false);
    }
  };

  const requestDeletePost = async () => {
    const isDelete = window.confirm("게시글을 삭제할까요?");
    if (!isDelete) return;
    try {
      await apiDelete(`/community/${postId}`).then((response) => {
        if (response.data.post_id === Number(postId)) {
          alert("게시글을 삭제했습니다!");
          navigate(`/community`);
        }
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const isMyComment = (commentAuthor: string) => {
    return user.getUsername() === commentAuthor;
  };

  const isMyPost = (postAuthor: string) => {
    return user.getUsername() === postAuthor;
  };

  const requestUpdateComment = async (
    commentId: number,
    comment_content: string
  ) => {
    if (isEditingComment) return;
    setIsEditingComment(true);
    try {
      const isUpdate = window.confirm("댓글을 수정할까요?");
      if (!isUpdate) return;
      const response = await apiPut(`/comments/${commentId}`, {
        content: comment_content,
      });

      if (response.data) {
        alert("댓글을 수정했습니다!");
        window.location.reload();
      }
      setIsEditingComment(false);
    } catch (error) {
      console.error("Error like comment:", error);
      setIsEditingComment(false);
    }
  };

  const handlePostReply = async (commentId: number, reply_content: string) => {
    if (isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      const response = await apiPost(`/comments/${commentId}/reply`, {
        content: reply_content,
      });

      if (response.status === 201) {
        alert("답글 작성에 성공했습니다!");
        window.location.reload();
      } else {
        console.error("Error in response after posting reply.");
      }
      setIsSubmittingReply(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      setIsSubmittingReply(false);
    }
  };

  const requestDeleteComment = async (commentId: number) => {
    try {
      const isDelete = window.confirm(
        "댓글을 삭제할까요? (답글이 있는 댓글은 내용만 삭제됩니다)"
      );
      if (!isDelete) return;
      const response = await apiDelete(`/comments/${commentId}`);

      if (response.data) {
        alert("댓글을 삭제했습니다!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setIsLoading(true);
        Promise.all([
          apiGet(`/community/${postId}`),
          apiGet(`/community/${postId}/comments`),
        ])
          .then(([postData, commentData]) => {
            setPost(postData.data);
            setComments(commentData.data);
            const allAuthors = getAllAuthors(comments);
            setUniqueCommenters(allAuthors);

            setIsLoading(false);
            window.scrollTo(0, 0);
          })
          .catch((error) => {
            if (
              error.response.data.message === "게시물을 찾을 수 없습니다." &&
              error.response.status === 404
            ) {
              navigate("/community");
              alert("존재하지 않는 게시글입니다.");
            }
            console.error("Error fetching post and comments:", error);
          });
      } catch (error) {
        console.error("Error in fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchPostAndComments();
  }, [postId]);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className={styles.communityPostViewContainer}>
        {post && (
          <Card className={styles.card}>
            <div className={styles.mainTop}>
              <Card.Title
                className={styles.cardTitle}
                style={{ display: "flex" }}
              >
                <Badge
                  bg="#236969"
                  style={{
                    backgroundColor: "#236969",
                    marginRight: "10px",
                    height: "30px",
                  }}
                >
                  {post.post_category}
                </Badge>
                <div>
                  {post.reported
                    ? "신고 누적으로 삭제된 게시물입니다."
                    : post.post_title}
                </div>
              </Card.Title>
              <div className={styles.mainBottom}>
                <div style={{ display: "flex" }}>
                  <div className={styles.sharp}>#{post.post_id}</div>
                  <div className={styles.date}>
                    {new Date(
                      new Date(post.post_time).getTime() + diffMSec
                    ).toLocaleDateString()}{" "}
                    {new Date(
                      new Date(post.post_time).getTime() + diffMSec
                    ).toLocaleTimeString()}
                    {post.updated ? " (수정됨)" : ""}
                    <span
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handlePostReport(post.post_id)}
                    >
                      | &nbsp;신고하기
                    </span>
                  </div>
                </div>
                <div
                  className={
                    post.liked ? styles.onLikeButton : styles.likeButton
                  }
                  style={{ cursor: "pointer" }}
                >
                  <span onClick={requestLikePost}>
                    <img
                      src={
                        post.liked
                          ? "/images/likeGreen.svg"
                          : "/images/likeWhiteSolidBlack.svg"
                      }
                      alt="likes-icon"
                      style={{
                        marginRight: "5px",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    <span
                      className={post.liked ? styles.likeCount : styles.none}
                    >
                      {post.post_likes}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <Card.Body className="text-start">
              {isPostEdit ? (
                <>
                  <Form.Control
                    type="text"
                    value={editPostTitle}
                    onChange={(e) => setEditPostTitle(e.target.value)}
                    placeholder="제목"
                    required
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <Form.Control
                    as="textarea"
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    placeholder="내용"
                    required
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="primary"
                      onClick={submitPostEdit}
                      disabled={isEditingPost}
                    >
                      제출
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsPostEdit(false)}
                    >
                      취소
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {!post.reported && isMyPost(post.post_author) && (
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="outline-primary"
                        onClick={handleEditPost}
                        style={{ borderRadius: "20px" }}
                      >
                        수정
                      </Button>{" "}
                      <Button
                        variant="outline-danger"
                        onClick={requestDeletePost}
                        style={{ borderRadius: "20px" }}
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                  <Card.Text className={styles.cardText}>
                    {post.reported
                      ? "신고 누적으로 삭제된 게시물입니다."
                      : post.post_content.replace(/<br\s*[/]?>/gi, "\n")}
                  </Card.Text>
                </>
              )}
            </Card.Body>
          </Card>
        )}

        <div className="comment-section">
          {post && (
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
              <span> 댓글 {post.post_comments} 개</span>
            </div>
          )}

          <div className="comment-input-group">
            <Form.Control
              className={styles.send}
              as="textarea"
              value={newComment}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setNewComment(e.target.value);
                }
              }}
              placeholder="댓글을 작성해주세요 (200자 이내)"
              style={{
                marginRight: "10px",
                flexGrow: 1,
                height: "40px",
                borderRadius: "20px",
                paddingBottom: "5px",
                paddingTop: "8px",
              }}
            />
            <div
              onClick={handlePostComment}
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

          <div className="comments-list" style={{ width: "100%" }}>
            {comments.map((comment, index) => (
              <Card key={comment.comment_id} className={styles.comment}>
                <div className={styles.cardHeader}>
                  <div
                    className={styles.cardCircle}
                    style={{
                      backgroundColor: getCommentBackgroundColor(
                        comment.comment_author,
                        post?.post_author || ""
                      ),
                    }}
                  ></div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className={styles.author}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        boxShadow: `inset 0 -10px ${getCommentBackgroundColor(
                          comment.comment_author,
                          post?.post_author || ""
                        )}`,
                      }}
                    >
                      {getAuthorName(
                        comment.comment_author,
                        post?.post_author || ""
                      )}
                    </span>
                    <span className={styles.date}>
                      {new Date(
                        new Date(comment.comment_time).getTime() + diffMSec
                      ).toLocaleDateString()}{" "}
                      {new Date(
                        new Date(comment.comment_time).getTime() + diffMSec
                      ).toLocaleTimeString()}
                      {comment.updated ? " (수정됨)" : ""}
                    </span>
                  </div>
                </div>
                <Card.Body
                  className={styles.cardBody}
                  style={{ paddingBottom: "5px" }}
                >
                  {isCommentUpdate &&
                  updateComment != null &&
                  comment.comment_id == updateComment.comment_id ? (
                    <div>
                      <Form.Control
                        className={styles.send}
                        as="textarea"
                        value={updateComment.comment_content}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            setUpdateComment((prevState) => {
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
                        onClick={() =>
                          requestUpdateComment(
                            comment.comment_id,
                            updateComment!.comment_content
                          )
                        }
                      >
                        수정
                      </span>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "gray",
                        }}
                        onClick={() => setIsCommentUpdate(false)}
                      >
                        취소
                      </span>
                    </div>
                  ) : (
                    <Card.Text>
                      {comment.reported ? (
                        <em style={{ opacity: 0.7 }}>
                          [신고 누적으로 삭제된 댓글입니다.]
                        </em>
                      ) : comment.comment_content === null ? (
                        <em style={{ opacity: 0.7 }}>[삭제된 댓글입니다.]</em>
                      ) : (
                        comment.comment_content
                      )}
                    </Card.Text>
                  )}
                </Card.Body>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      float: "right",
                      marginLeft: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => requestLikeComment(comment.comment_id)}
                  >
                    <img
                      src={
                        comment.liked
                          ? "/images/likeGreen.svg"
                          : "/images/likeWhiteSolidBlack.svg"
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
                        comment.liked
                          ? {
                              fontSize: "14px",
                              color: "green",
                              fontWeight: "bolder",
                              display: "inline-block",
                              margin: 0,
                              padding: 0,
                            }
                          : {
                              fontSize: "14px",
                              color: "gray",
                              display: "inline-block",
                              margin: 0,
                              padding: 0,
                            }
                      }
                    >
                      추천 {comment.comment_likes}
                    </span>
                  </div>
                  <div>
                    {isMyComment(comment.comment_author) &&
                    !isCommentUpdate &&
                    comment.comment_content !== null ? (
                      <span
                        style={{
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "gray",
                        }}
                        onClick={() => {
                          setIsCommentUpdate(true);
                          setUpdateComment((prevState) => {
                            if (prevState == null)
                              return {
                                comment_id: comment.comment_id,
                                comment_content: comment.comment_content,
                                comment_author: comment.comment_author,
                                comment_likes: comment.comment_likes,
                                comment_time: comment.comment_time,
                                liked: comment.liked,
                                replies: comment.replies,
                                updated: comment.updated,
                                reported: comment.reported,
                              };
                            return {
                              comment_id: comment.comment_id,
                              comment_content: comment.comment_content,
                              comment_author: comment.comment_author,
                              comment_likes: comment.comment_likes,
                              comment_time: comment.comment_time,
                              liked: comment.liked,
                              replies: comment.replies,
                              updated: comment.updated,
                              reported: comment.reported,
                            };
                          });
                        }}
                      >
                        &nbsp;| &nbsp; 수정&nbsp;
                      </span>
                    ) : null}
                    {isMyComment(comment.comment_author) &&
                    comment.comment_content !== null ? (
                      <span
                        style={{
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "gray",
                        }}
                        onClick={() => requestDeleteComment(comment.comment_id)}
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
                      onClick={() => {
                        const updatedToggles = [...writeReplyToggle];
                        updatedToggles[index] = !updatedToggles[index];
                        setWriteReplyToggle(updatedToggles);
                      }}
                    >
                      &nbsp;| &nbsp; 답글작성
                    </span>
                    <span
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "gray",
                      }}
                      onClick={() => handleCommentReport(comment.comment_id)}
                    >
                      | &nbsp;신고하기
                    </span>
                  </div>
                </div>
                <div className="replies">
                  {comment.replies.map((reply) => (
                    <Card
                      key={reply.reply_id}
                      className={styles.comment}
                      style={{ marginLeft: "10%" }}
                    >
                      <span className="reply-arrow"></span>
                      <div className={styles.cardHeader}>
                        <div
                          className={styles.cardCircle}
                          style={{
                            backgroundColor: getCommentBackgroundColor(
                              reply.reply_author,
                              post?.post_author || ""
                            ),
                          }}
                        ></div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            className={styles.author}
                            style={{
                              position: "relative",
                              display: "inline-block",
                              boxShadow: `inset 0 -10px ${getCommentBackgroundColor(
                                reply.reply_author,
                                post?.post_author || ""
                              )}`,
                            }}
                          >
                            {getAuthorName(
                              reply.reply_author,
                              post?.post_author || ""
                            )}
                          </span>
                          <span className={styles.date}>
                            {new Date(
                              new Date(reply.reply_time).getTime() + diffMSec
                            ).toLocaleDateString()}{" "}
                            {new Date(
                              new Date(reply.reply_time).getTime() + diffMSec
                            ).toLocaleTimeString()}
                            {reply.updated ? " (수정됨)" : ""}
                          </span>
                        </div>
                      </div>
                      <Card.Body
                        className={styles.cardBody}
                        style={{ paddingBottom: "5px" }}
                      >
                        {isCommentUpdate &&
                        updateComment != null &&
                        reply.reply_id === updateComment.comment_id ? (
                          <div>
                            <Form.Control
                              className={styles.send}
                              as="textarea"
                              value={updateComment.comment_content}
                              onChange={(e) => {
                                if (e.target.value.length <= 200) {
                                  setUpdateComment((prevState) => {
                                    if (prevState == null) return null;
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
                              onClick={() =>
                                requestUpdateComment(
                                  reply.reply_id,
                                  updateComment!.comment_content
                                )
                              }
                            >
                              수정
                            </span>
                            <span
                              style={{
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "gray",
                              }}
                              onClick={() => setIsCommentUpdate(false)}
                            >
                              취소
                            </span>
                          </div>
                        ) : (
                          <Card.Text>
                            {reply.reported ? (
                              <em style={{ opacity: 0.7 }}>
                                [신고 누적으로 삭제된 답글입니다.]
                              </em>
                            ) : (
                              reply.reply_content
                            )}
                          </Card.Text>
                        )}
                      </Card.Body>
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            float: "right",
                            marginLeft: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => requestLikeComment(reply.reply_id)}
                        >
                          <img
                            src={
                              reply.liked
                                ? "/images/likeGreen.svg"
                                : "/images/likeWhiteSolidBlack.svg"
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
                              reply.liked
                                ? {
                                    fontSize: "14px",
                                    color: "green",
                                    fontWeight: "bolder",
                                  }
                                : { fontSize: "14px", color: "gray" }
                            }
                          >
                            추천 {reply.reply_likes}
                          </span>
                        </div>
                        <div>
                          {!reply.reported &&
                          isMyComment(reply.reply_author) &&
                          !isCommentUpdate ? (
                            <span
                              style={{
                                marginLeft: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "gray",
                              }}
                              onClick={() => {
                                setIsCommentUpdate(true);
                                setUpdateComment((prevState) => {
                                  if (prevState == null)
                                    return {
                                      comment_id: reply.reply_id,
                                      comment_content: reply.reply_content,
                                      comment_author: reply.reply_author,
                                      comment_likes: reply.reply_likes,
                                      comment_time: reply.reply_time,
                                      liked: reply.liked,
                                      replies: [],
                                      updated: reply.updated,
                                      reported: reply.reported,
                                    };
                                  return {
                                    comment_id: reply.reply_id,
                                    comment_content: reply.reply_content,
                                    comment_author: reply.reply_author,
                                    comment_likes: reply.reply_likes,
                                    comment_time: reply.reply_time,
                                    liked: reply.liked,
                                    replies: [],
                                    updated: reply.updated,
                                    reported: reply.reported,
                                  };
                                });
                              }}
                            >
                              &nbsp;| &nbsp; 수정&nbsp;
                            </span>
                          ) : null}
                          {!reply.reported &&
                          isMyComment(reply.reply_author) ? (
                            <span
                              style={{
                                marginLeft: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "gray",
                              }}
                              onClick={() =>
                                requestDeleteComment(reply.reply_id)
                              }
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
                            onClick={() => handleCommentReport(reply.reply_id)}
                          >
                            | &nbsp;신고하기
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div>
                  {writeReplyToggle[index] ? (
                    <div>
                      <Form.Control
                        className={styles.send}
                        as="textarea"
                        value={newReply}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            setNewReply(e.target.value);
                          }
                        }}
                        placeholder="답글을 작성해주세요 (200자 이내)"
                        style={{
                          marginRight: "10px",
                          marginTop: "15px",
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
                        onClick={() =>
                          handlePostReply(comment.comment_id, newReply)
                        }
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
        </div>
      </Container>
    </PageView>
  );
}
