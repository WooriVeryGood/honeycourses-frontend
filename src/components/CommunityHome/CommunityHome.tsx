import React, { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import { Badge, Button, Card, Container } from "react-bootstrap";
import { Auth } from "aws-amplify";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Community.module.css";
import Paging from "../Paging/Paging";

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [layoutRightTitle, setTitle] = useState("All"); //오른쪽 layout 제목 설정
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const dateA = new Date("2022/06/01 08:00:00");
  const dateB = new Date("2022/06/01 00:00:00");
  const diffMSec = dateA.getTime() - dateB.getTime();

  //분류
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setTitle(category);
  };

  useEffect(() => {
    const fetchDataFromApi = async (pageNo: number) => {
      try {
        const userSession = await Auth.currentSession();
        const jwtToken = userSession.getAccessToken().getJwtToken();

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        setIsLoading(true);
        const response = await axios.get(
          `${apiUrl}/community?page=${pageNo - 1}`,
          {
            headers,
          }
        );
        setPosts(response.data.posts);
        setTotalItemsCount(response.data.totalPostCount);
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchDataFromApi(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 카테고리별 게시글 분류
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.post_category === selectedCategory);

  return (
    <div>
      <PageView isLoading={isLoading}>
        <Container
          fluid
          className="justify-content-center align-items-start"
          style={{ justifyContent: "center", display: "flex" }}
        >
          <div className={styles.communityContainer}>
            <div className={styles.comLeft}>
              <div className={styles.listLayout}>
                <div className="d-flex flex-wrap align-items-left">
                  <h2>커뮤니티</h2>
                </div>

                <nav>
                  <ul className={styles.categories}>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "All" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("All")}
                      >
                        All
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "자유" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("자유")}
                      >
                        자유
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "질문" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("질문")}
                      >
                        질문
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "중고거래" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("중고거래")}
                      >
                        중고거래
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "구인" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("구인")}
                      >
                        구인
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className={styles.comRight}>
              <div className={styles.rightHeader}>
                {layoutRightTitle}
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
              <div className={styles.groupReviews}>
                {filteredPosts.map((post) => (
                  <Link
                    to={`/community/view/${post.post_id}`}
                    key={post.post_id}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card className={styles.card}>
                      <Card.Body className="text-start">
                        <Card.Title
                          style={{
                            color: "#43A680",
                            fontWeight: "800",
                            display: "flex",
                          }}
                        >
                          <Badge
                            bg="#236969"
                            style={{
                              backgroundColor: "#236969",
                              marginRight: "10px",
                              height: "25px",
                            }}
                          >
                            {post.post_category}
                          </Badge>
                          <div>{post.post_title}</div>
                        </Card.Title>

                        <Card.Text
                          style={{
                            height: "4.8em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "3",
                            WebkitBoxOrient: "vertical",
                            whiteSpace: "pre-line",
                            color: "#888893",
                            fontWeight: "600",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: post.post_content,
                          }}
                        ></Card.Text>

                        <div
                          className={styles.dateNpostID}
                          style={{ display: "flex" }}
                        >
                          <div style={{ display: "flex" }}>
                            <div className={styles.sharp}>#{post.post_id}</div>
                            <div>
                              {new Date(
                                new Date(post.post_time).getTime() + diffMSec
                              ).toLocaleDateString()}{" "}
                              {new Date(
                                new Date(post.post_time).getTime() + diffMSec
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className={styles.likeComment}>
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
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                ))}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Paging
                    page={currentPage}
                    count={totalItemsCount}
                    setPage={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </PageView>
    </div>
  );
}
