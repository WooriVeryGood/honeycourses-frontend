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
  "#91C8E4",//파
  "#EAC696",//갈
  "#C8E4B2",//초
  "#D8D9DA",//회
  "#FFE17B",//노
  "#DFCCFB",//보
  "#E19898",//핑
  "#33BBC5",//파
  "#A8DF8E",//초
  "#EBE76C",//겨
  "#5C5470",//짙회
  "#A6E3E9",//하
  "#E3FDFD",//연하
  "#A6B1E1",//연남
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
  const postId = window.location.pathname.split("/").pop();

  const getCommentBackgroundColor = (
    commentAuthor: string,
    postAuthor: string
  ) => {
    if (commentAuthor === postAuthor)
      return "white";
    
    const authorPosition = uniqueCommenters.indexOf(commentAuthor);
    if (authorPosition === -1) 
      return "white";
    return commentBackgroundColors[authorPosition % commentBackgroundColors.length];
  };

  const getAuthorName = (commentAuthor: string, postAuthor: string) => {
    if (commentAuthor === postAuthor)
      return "작성자";

    const authorPosition = uniqueCommenters.indexOf(commentAuthor);
    if (authorPosition === -1)
      return "Unknown";
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
        if (liked)
          alert("게시글을 추천했습니다!");
        else
          alert("게시글 추천을 취소했습니다!");
        if (post !== (undefined || null)) {
          post.liked = liked;
          post.post_likes = response.data.like_count;
          setPost((prevState) => {
            if (prevState == (undefined || null))
              return prevState;
            return {
              ...prevState,
              liked: liked,
              post_likes: response.data.like_count
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
        if (liked)
          alert("댓글을 추천했습니다!");
        else
          alert("댓글 추천을 취소했습니다!");
        setComments(
          comments.map((comment) =>
            comment.comment_id != commentId ? comment : { ...comment, comment_likes: response.data.like_count, liked: response.data.liked}
          )
        )
      }
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  const isMyComment = (commentAuthor: string) => {
    return user.getUsername() == commentAuthor;
  };

  const requestDeleteComment = async (commentId: number) => {
    try {
      const isDelete = window.confirm("댓글을 삭제할까요?");
      if (!isDelete)
        return;
      const headers = await apiHeader();
      const response = await axios.delete(
        `${apiUrl}/comments/${commentId}`,
        { headers }
      );

      if (response.data) {
        const deletedCommentId = response.data.comment_id;
        alert("댓글을 삭제했습니다!");
        setComments(
          comments.filter((comment) =>
            comment.comment_id != deletedCommentId
          )
        )
      }
    } catch (error) {
      console.error("Error like comment:", error);
    }
  }

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const headers = await apiHeader();
        setIsLoading(true);
        const postData = await axios.get(
          `${apiUrl}/community/${postId}`, 
          { headers }
        );
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
                <div className={styles.sharp}>
                  #{post.post_id}
                </div>
                <div className={styles.date}>
                  {new Date(post.post_time).toLocaleDateString()}{" "}
                  {new Date(post.post_time).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <Card.Body className="text-start">
              <Card.Text className={styles.cardText}>
                {post.post_content.replace(/<br\s*[/]?>/gi, "\n")}
              </Card.Text>
              <div className={styles.likeComment}>
                <span style={{ cursor: "pointer" }} onClick={requestLikePost}>
                  <img
                    src="/images/like.svg"
                    alt="likes-icon"
                    style={{
                      marginRight: "5px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <span>{post.post_likes}</span>{" "}
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
                <span>{post.post_comments}</span>{" "}
              </div>
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
            <i className="bi bi-send" onClick={handlePostComment} style={{ alignSelf: "flex-end", fontSize: "170%", cursor: "pointer" }} ></i>
          </div>

          <div className="comments-list" style={{ width: "100%" }}>
            {comments.map((comment) => (
              <Card
                key={comment.comment_id}
                className={styles.comment}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardCircle} style={{
                    backgroundColor: getCommentBackgroundColor(
                      comment.comment_author,
                      post?.post_author || ""
                    ),
                  }}>
                  </div>
                  <div>
                    <span className={styles.author}
                      style={{
                        position: "relative", display: "inline-block", boxShadow: `inset 0 -10px ${getCommentBackgroundColor(
                          comment.comment_author,
                          post?.post_author || ""
                        )}`
                      }}>
                      {getAuthorName(
                        comment.comment_author,
                        post?.post_author || ""
                      )}
                    </span>
                    <span className={styles.date}>
                      {new Date(comment.comment_time).toLocaleDateString()}{" "}
                      {new Date(comment.comment_time).toLocaleTimeString()}
                    </span>
                    <div style={{ float: "right", marginLeft: "8px", cursor: "pointer"}} onClick={() => requestLikeComment(comment.comment_id)}>
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
                  
                    {(isMyComment(comment.comment_author)) ? 
                      <span style={{ marginLeft: "8px", cursor: "pointer", fontSize: "14px" }} onClick={() => requestDeleteComment(comment.comment_id)}>
                        댓글 삭제
                      </span> : 
                      null}
                  </div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <Card.Text>{comment.comment_content}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </PageView>
  );
}
