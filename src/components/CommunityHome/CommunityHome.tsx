import React, { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import { Badge, Button, ButtonGroup, Card, Container } from "react-bootstrap";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import axios from "axios";
import { Link } from "react-router-dom";

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

const apiUrl = process.env.REACT_APP_API_URL;

export default function CommunityHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  function renderPostContent(content: string) {
    const contentWithLineBreaks = content.split(/<br\s*[/]?>/gi);
    return contentWithLineBreaks.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== contentWithLineBreaks.length - 1 && <br />}
      </React.Fragment>
    ));
  }

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const userSession = await Auth.currentSession();
        const jwtToken = userSession.getIdToken().getJwtToken();

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        setIsLoading(true);
        const response = await axios.get(`${apiUrl}/community`, { headers });
        console.log(response.data);
        setPosts(
          response.data.sort((a: Post, b: Post) => b.post_id - a.post_id)
        );
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchDataFromApi();
  }, []);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className="justify-content-center align-items-start">
        <div
          className="d-flex flex-wrap align-items-left"
          style={{ marginBottom: "15px" }}
        >
          <h2 style={{ margin: "0 5%" }}>커뮤니티 (베타)</h2>
          <Button
            href="/community/addPost"
            className="my-auto align-self-center"
            variant="success"
            size="sm"
            style={{
              marginLeft: "20px",
              backgroundColor: "#43A680",
              borderColor: "#43A680",
            }}
          >
            <img
              src="/images/plus.svg"
              className="bi"
              width="23"
              height="23"
              alt="github-icon"
            />
            글 작성
          </Button>
        </div>

        {posts.map((post) => (
          <Link
            to={`/community/view/${post.post_id}`}
            key={post.post_id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
                  style={{
                    height: "4.8em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    whiteSpace: "pre-line", 
                  }}
                  dangerouslySetInnerHTML={{ __html: post.post_content }}
                ></Card.Text>

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
                    src="../images/like.svg"
                    alt="likes-icon"
                    style={{
                      marginRight: "5px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                  <span>{post.post_likes}</span>{" "}
                  <img
                    src="../images/comments.svg"
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
          </Link>
        ))}
      </Container>
    </PageView>
  );
}
