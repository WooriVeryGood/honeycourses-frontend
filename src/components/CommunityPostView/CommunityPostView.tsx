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

interface Post {
  post_id: number;
  post_category: string;
  post_title: string;
  post_content: string;
  post_comments: number;
  post_likes: number;
  post_author: string;
  post_time: string;
}

interface Comment {
  comment_id: number;
  comment_content: string;
  comment_author: string;
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

export default function CommunityPostView() {
  const { user } = useAuthenticator((context) => [context.user, context.route]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueCommenters, setUniqueCommenters] = useState<string[]>([]);
  const postId = window.location.pathname.split("/").pop();

  const commentColors = [
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
    "#B39DDB",
    "#FF8A80",
    "#90A4AE",
    "#C5E1A5",
    "#E6EE9C",
    "#80DEEA",
    "#80CBC4",
    "#FFE0B2",
    "#B3E5FC",
    "#B2DFDB",
    "#E1BEE7",
    "#F8BBD0",
  ];

  const getCommentBackgroundColor = (
    commentAuthorHash: string,
    postAuthorHash: string
  ) => {
    if (commentAuthorHash === postAuthorHash) {
      return "white";
    }
    const authorPosition = uniqueCommenters.indexOf(commentAuthorHash);
    if (authorPosition === -1) {
      return "white";
    }
    return commentColors[authorPosition % commentColors.length];
  };

  const getCognitoToken = async () => {
    try {
      const userSession = await Auth.currentSession();
      return userSession.getIdToken().getJwtToken();
    } catch (error) {
      console.error("Error getting Cognito token:", error);
      return null;
    }
  };

  const getAuthorName = (commentAuthorHash: string, postAuthorHash: string) => {
    if (commentAuthorHash === postAuthorHash) {
      return "작성자";
    }
    const authorPosition = uniqueCommenters.indexOf(commentAuthorHash);
    if (authorPosition === -1) {
      return "Unknown";
    }
    return pseudonyms[authorPosition % pseudonyms.length];
  };

  const handlePostComment = async () => {
    try {
      const jwtToken = await getCognitoToken();
      if (!jwtToken) {
        console.error("Cognito token not available");
        return;
      }

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const response = await axios.post(
        `${apiUrl}/community/${postId}/comment`,
        {
          content: newComment,
          email: user?.attributes?.email,
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

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const jwtToken = await getCognitoToken();
        if (!jwtToken) {
          console.error("Cognito token not available");
          return;
        }

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        setIsLoading(true);
        const postData = await axios.get(`${apiUrl}/community/${postId}`, {
          headers,
        });
        setPost(postData.data[0]);

        const commentsData = await axios.get(
          `${apiUrl}/community/${postId}/comments`,
          { headers }
        );
        setComments(commentsData.data);

        const uniqueAuthors = commentsData.data.reduce(
          (acc: string[], curr: Comment) => {
            if (
              curr.comment_author !== postData.data[0].post_author &&
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
      <Container fluid className="justify-content-center align-items-start">
        {post && (
          <Card
            style={{ width: "90%", marginBottom: "30px" }}
            className="mx-auto"
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                color: "grey",
              }}
            >
              #{post.post_id}
            </div>
            <Card.Body className="text-start">
              <Card.Title style={{ color: "#43A680" }}>
                <Badge
                  bg="#236969"
                  style={{ backgroundColor: "#236969", marginRight: "10px" }}
                >
                  {post.post_category}
                </Badge>
                {post.post_title}
              </Card.Title>
              <hr className="divider"></hr>
              <Card.Text
                style={{ whiteSpace: "pre-wrap", marginBottom: "30px" }}
              >
                {post.post_content.replace(/<br\s*[/]?>/gi, "\n")}
              </Card.Text>
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "15px",
                  display: "flex",
                  alignItems: "center",
                }}
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
                <span>{post.post_likes}</span>{" "}
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
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "15px",
                  color: "grey",
                  fontSize: "12px",
                }}
              >
                {new Date(post.post_time).toLocaleDateString()}{" "}
                {new Date(post.post_time).toLocaleTimeString()}
              </div>
            </Card.Body>
          </Card>
        )}

        <div className="comment-section">
          <div className="comment-input-group">
            <Form.Control
              as="textarea"
              value={newComment}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setNewComment(e.target.value);
                }
              }}
              placeholder="댓글을 작성해주세요 (200자 이내)"
              style={{ marginRight: "10px", flexGrow: 1 }}
            />
            <Button
              onClick={handlePostComment}
              style={{ alignSelf: "flex-end" }}
            >
              댓글 작성
            </Button>
          </div>

          <div className="comments-list" style={{ width: "100%" }}>
            {comments.map((comment) => (
              <Card
                key={comment.comment_id}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  backgroundColor: getCommentBackgroundColor(
                    comment.comment_author,
                    post?.post_author || ""
                  ),
                }}
                className="mx-auto"
              >
                <Card.Header>
                  {getAuthorName(
                    comment.comment_author,
                    post?.post_author || ""
                  )}
                </Card.Header>
                <Card.Body className="text-start">
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
