import React, { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Auth } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import "./CommunityPostView.css";
import styles from "./communityPostView.module.css";
import { useNavigate } from "react-router-dom";

interface Post {
  post_id: number;
  post_category: string;
  post_title: string;
  post_content: string;
  post_comments: number;
  post_likes: number;
  post_author: string;
  post_time: string;
  liked: boolean;
}

interface Reply {
  reply_id: number;
  reply_content: string;
  reply_author: string;
  reply_likes: number;
  reply_time: string;
  liked: boolean;
}

interface Comment {
  comment_id: number;
  comment_content: string;
  comment_author: string;
  comment_likes: number;
  comment_time: string;
  liked: boolean;
  replies: Reply[];
}

const apiUrl = process.env.REACT_APP_API_URL;

const pseudonyms = [
  "Alice",
  "Bob",
  "Carol",
  "Dave",
  "Eve",
  "Francis",
  "Grace",
  "Hans",
  "Isabella",
  "Jason",
  "Kate",
  "Louis",
  "Margaret",
  "Nathan",
  "Olivia",
  "Paul",
  "Queen",
  "Richard",
  "Susan",
  "Thomas",
  "Uma",
  "Vivian",
  "Winnie",
  "Xander",
  "Yasmine",
  "Zach",
];

const commentBackgroundColors = [
  "#91C8E4", //파
  "#EAC696", //갈
  "#C8E4B2", //초
  "#D8D9DA", //회
  "#FFE17B", //노
  "#DFCCFB", //보
  "#E19898", //핑
  "#33BBC5", //파
  "#A8DF8E", //초
  "#EBE76C", //겨
  "#5C5470", //짙회
  "#A6E3E9", //하
  "#E3FDFD", //연하
  "#A6B1E1", //연남
  "#d9e1fc",
  "#edd9f2",
  "#d9f2e5",
  "#FFD54F",
  "#A1887F",
  "#FFAB91",
  "#FFCC80",
  "#FFF176",
  "#DCE775",
  "#AED581",
  "#81C784",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
];

const getCognitoToken = async () => {
  try {
    const userSession = await Auth.currentSession();
    return userSession.getAccessToken().getJwtToken();
  } catch (error) {
    console.error("Error getting Cognito token:", error);
    return null;
  }
};

const apiHeader = async () => {
  const jwtToken = await getCognitoToken();
  if (!jwtToken) {
    console.error("Cognito token not available");
    return;
  }
  return {
    Authorization: `Bearer ${jwtToken}`,
  };
};

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
      authors.add(comment.comment_author);
      comment.replies.forEach((reply) => {
        authors.add(reply.reply_author);
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
      const headers = await apiHeader();
      const response = await axios.post(
        `${apiUrl}/community/${postId}/comments`,
        {
          content: newComment,
        },
        { headers }
      );

      if (response.data) {
        alert("댓글 작성에 성공했습니다!");
        window.location.reload();
      } else {
        console.error("Error in response after posting comment.");
      }
      setIsSubmittingComment(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      setIsSubmittingComment(false);
    }
  };

  const requestLikePost = async () => {
    try {
      const headers = await apiHeader();
      const response = await axios.put(
        `${apiUrl}/community/${postId}/like`,
        null,
        { headers }
      );

      if (response.data) {
        const liked = response.data.liked;
        if (liked) alert("게시글을 추천했습니다!");
        else alert("게시글 추천을 취소했습니다!");
        if (post !== (undefined || null)) {
          post.liked = liked;
          post.post_likes = response.data.like_count;
          setPost((prevState) => {
            if (prevState == (undefined || null)) return prevState;
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
      const headers = await apiHeader();
      const response = await axios.put(
        `${apiUrl}/comments/${commentId}/like`,
        null,
        { headers }
      );

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
      const headers = await apiHeader();
      const response = await axios.put(
        `${apiUrl}/community/${postId}`,
        {
          post_title: editPostTitle,
          post_content: editPostContent,
        },
        { headers }
      );

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
      const headers = await apiHeader();
      await axios.delete(`${apiUrl}/community/${postId}`, { headers });
      alert("게시글을 삭제했습니다!");
      navigate(`/community`);
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
      const headers = await apiHeader();
      const response = await axios.put(
        `${apiUrl}/comments/${commentId}`,
        {
          content: comment_content,
        },
        { headers }
      );

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
      const headers = await apiHeader();
      const response = await axios.post(
        `${apiUrl}/comments/${commentId}/reply`,
        {
          content: reply_content,
        },
        { headers }
      );

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
      const headers = await apiHeader();
      const response = await axios.delete(`${apiUrl}/comments/${commentId}`, {
        headers,
      });

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
        const headers = await apiHeader();
        setIsLoading(true);
        const postData = await axios.get(`${apiUrl}/community/${postId}`, {
          headers,
        });
        setPost(postData.data);

        const response = await axios.get(
          `${apiUrl}/community/${postId}/comments`,
          { headers }
        );
        setComments(response.data);

        const uniqueAuthors = response.data.reduce(
          (acc: string[], curr: Comment) => {
            if (
              curr.comment_author !== postData.data.post_author &&
              !acc.includes(curr.comment_author)
            ) {
              acc.push(curr.comment_author);
            }
            return acc;
          },
          []
        );
        setUniqueCommenters(uniqueAuthors);

        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
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
                <div>{post.post_title}</div>
              </Card.Title>
              <div className={styles.mainBottom}>
                <div style={{ display: "flex" }}>
                  <div className={styles.sharp}>#{post.post_id}</div>
                  <div className={styles.date}>
                    {new Date(post.post_time).toLocaleDateString()}{" "}
                    {new Date(post.post_time).toLocaleTimeString()}
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
                  {isMyPost(post.post_author) && (
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
                    {post.post_content.replace(/<br\s*[/]?>/gi, "\n")}
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
                      {new Date(comment.comment_time).toLocaleDateString()}{" "}
                      {new Date(comment.comment_time).toLocaleTimeString()}
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
                      {comment.comment_content === null ? (
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
                              };
                            return {
                              comment_id: comment.comment_id,
                              comment_content: comment.comment_content,
                              comment_author: comment.comment_author,
                              comment_likes: comment.comment_likes,
                              comment_time: comment.comment_time,
                              liked: comment.liked,
                              replies: comment.replies,
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
                            {new Date(reply.reply_time).toLocaleDateString()}{" "}
                            {new Date(reply.reply_time).toLocaleTimeString()}
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
                          <Card.Text>{reply.reply_content}</Card.Text>
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
                          {isMyComment(reply.reply_author) &&
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
                                    };
                                  return {
                                    comment_id: reply.reply_id,
                                    comment_content: reply.reply_content,
                                    comment_author: reply.reply_author,
                                    comment_likes: reply.reply_likes,
                                    comment_time: reply.reply_time,
                                    liked: reply.liked,
                                    replies: [],
                                  };
                                });
                              }}
                            >
                              &nbsp;| &nbsp; 수정&nbsp;
                            </span>
                          ) : null}
                          {isMyComment(reply.reply_author) ? (
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
