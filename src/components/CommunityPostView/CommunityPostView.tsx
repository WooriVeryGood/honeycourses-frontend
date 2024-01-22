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

interface Comment {
  comment_id: number;
  comment_content: string;
  comment_author: string;
  comment_likes: number;
  comment_time: string;
  liked: boolean;
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
  const navigate = useNavigate();

  const getCommentBackgroundColor = (
    commentAuthor: string,
    postAuthor: string
  ) => {
    if (commentAuthor === postAuthor) return "white";

    const authorPosition = uniqueCommenters.indexOf(commentAuthor);
    if (authorPosition === -1) return "white";
    return commentBackgroundColors[
      authorPosition % commentBackgroundColors.length
    ];
  };

  const getAuthorName = (commentAuthor: string, postAuthor: string) => {
    if (commentAuthor === postAuthor) return "작성자";

    const authorPosition = uniqueCommenters.indexOf(commentAuthor);
    if (authorPosition === -1) return "Unknown";
    return pseudonyms[authorPosition % pseudonyms.length];
  };

  const handlePostComment = async () => {
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
    } catch (error) {
      console.error("Error posting comment:", error);
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
          comments.map((comment) =>
            comment.comment_id != commentId
              ? comment
              : {
                  ...comment,
                  comment_likes: response.data.like_count,
                  liked: response.data.liked,
                }
          )
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
    } catch (error) {
      console.error("Error updating post:", error);
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
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  const requestDeleteComment = async (commentId: number) => {
    try {
      const isDelete = window.confirm("댓글을 삭제할까요?");
      if (!isDelete) return;
      const headers = await apiHeader();
      const response = await axios.delete(`${apiUrl}/comments/${commentId}`, {
        headers,
      });

      if (response.data) {
        const deletedCommentId = response.data.comment_id;
        alert("댓글을 삭제했습니다!");
        setComments(
          comments.filter((comment) => comment.comment_id != deletedCommentId)
        );
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
              <Card.Title className={styles.cardTitle}>
                <Badge
                  bg="#236969"
                  style={{ backgroundColor: "#236969", marginRight: "10px" }}
                >
                  {post.post_category}
                </Badge>
                {post.post_title}
              </Card.Title>
              <div className={styles.mainBottom}>
                <div className={styles.sharp}>#{post.post_id}</div>
                <div className={styles.date}>
                  {new Date(post.post_time).toLocaleDateString()}{" "}
                  {new Date(post.post_time).toLocaleTimeString()}
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
                  />
                  <Form.Control
                    as="textarea"
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    placeholder="내용"
                    required
                  />
                  <Button variant="primary" onClick={submitPostEdit}>
                    제출
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsPostEdit(false)}
                  >
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Card.Text className={styles.cardText}>
                    {post.post_content.replace(/<br\s*[/]?>/gi, "\n")}
                  </Card.Text>
                  <div className={styles.likeComment}>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={requestLikePost}
                    >
                      <img
                        src="/images/like.svg"
                        alt="likes-icon"
                        style={{
                          marginRight: "5px",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      <span>{post.post_likes}</span>
                    </span>
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
                    <span>{post.post_comments}</span>
                  </div>
                  {isMyPost(post.post_author) && (
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="outline-primary"
                        onClick={handleEditPost}
                      >
                        수정
                      </Button>{" "}
                      <Button
                        variant="outline-danger"
                        onClick={requestDeletePost}
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        )}

        <div className="comment-section">
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
              style={{ marginRight: "10px", flexGrow: 1, height: "40px" }}
            />
            <i
              className="bi bi-send"
              onClick={handlePostComment}
              style={{
                alignSelf: "flex-end",
                fontSize: "170%",
                cursor: "pointer",
              }}
            ></i>
          </div>

          <div className="comments-list" style={{ width: "100%" }}>
            {comments.map((comment) => (
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
                  <div>
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
                    <div
                      style={{
                        float: "right",
                        marginLeft: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => requestLikeComment(comment.comment_id)}
                    >
                      <img
                        src="/images/like.svg"
                        alt="likes-icon"
                        style={{
                          marginRight: "4px",
                          width: "14px",
                          height: "14px",
                        }}
                      />
                      <span style={{ fontSize: "14px" }}>
                        {comment.comment_likes}
                      </span>
                    </div>
                    {isMyComment(comment.comment_author) && !isCommentUpdate ? (
                      <span
                        style={{
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
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
                              };
                            return {
                              comment_id: comment.comment_id,
                              comment_content: comment.comment_content,
                              comment_author: comment.comment_author,
                              comment_likes: comment.comment_likes,
                              comment_time: comment.comment_time,
                              liked: comment.liked,
                            };
                          });
                        }}
                      >
                        수정
                      </span>
                    ) : null}

                    {isMyComment(comment.comment_author) ? (
                      <span
                        style={{
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                        onClick={() => requestDeleteComment(comment.comment_id)}
                      >
                        삭제
                      </span>
                    ) : null}
                  </div>
                </div>
                <Card.Body className={styles.cardBody}>
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
                      />
                      <span
                        style={{
                          marginRight: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
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
                        style={{ cursor: "pointer", fontSize: "14px" }}
                        onClick={() => setIsCommentUpdate(false)}
                      >
                        취소
                      </span>
                    </div>
                  ) : (
                    <Card.Text>{comment.comment_content}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </PageView>
  );
}
