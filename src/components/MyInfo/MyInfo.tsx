import React, { useEffect, useState } from "react";
import PageView from "../PageView/PageView";
import { apiGet } from "../API/APIHandler";
import styles from "./MyInfo.module.css";
import { Badge, Card, Container } from "react-bootstrap";
import Paging from "../Paging/Paging";
import { Link } from "react-router-dom";
import { useAuthenticator, AccountSettings } from "@aws-amplify/ui-react";


interface Review {
  review_title: string;
  course_id: number;
  review_id: number;
  review_content: string;
  like_count: number;
  course_name: string;
  voted: boolean;
  instructor_name: string;
  taken_semyr: string;
  grade: string;
  liked: boolean;
  review_time: string;
  mine: boolean;
  updated: boolean;
}

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

function MyInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [viewCategory, setViewCategory] = useState("정보");
  const [layoutRightTitle, setTitle] = useState("내 정보");
  const dateA = new Date("2022/06/01 08:00:00");
  const dateB = new Date("2022/06/01 00:00:00");
  const diffMSec = dateA.getTime() - dateB.getTime();
  const { user } = useAuthenticator((context) => [context.user]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSuccess = () => {
    alert('비밀번호 변경에 성공했습니다!');
    window.location.reload();
  }

  useEffect(() => {
    const fetchDataFromApi = async (pageNo: number) => {
      try {
        setIsLoading(true);
        Promise.all([
          apiGet(`/courses/reviews/me`),
          apiGet(`/community/me?page=${pageNo - 1}`),
        ])
          .then(([reviewsResponse, postsResponse]) => {
            const initializedReviews = reviewsResponse.data.map(
              (review: Review) => ({
                ...review,
              })
            );
            setReviews(initializedReviews);
            setPosts(postsResponse.data.posts);
            setTotalItemsCount(postsResponse.data.totalPostCount);
            setIsLoading(false);
            window.scrollTo(0, 0);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
            window.scrollTo(0, 0);
          });
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchDataFromApi(currentPage);
  }, [currentPage]);

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
                  <h2>내 정보</h2>
                </div>

                <nav>
                  <ul className={styles.categories}>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          viewCategory === "정보" ? "btn-primary" : ""
                        }`}
                        onClick={() => {
                          setViewCategory("정보");
                          setTitle("내 정보");
                        }}
                      >
                        정보
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          viewCategory === "리뷰" ? "btn-primary" : ""
                        }`}
                        onClick={() => {
                          setViewCategory("리뷰");
                          setTitle("내 리뷰");
                        }}
                      >
                        내 리뷰
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          viewCategory === "커뮤니티" ? "btn-primary" : ""
                        }`}
                        onClick={() => {
                          setViewCategory("커뮤니티");
                          setTitle("내 커뮤니티 글");
                        }}
                      >
                        내 게시글
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className={styles.comRight}>
              <div className={styles.rightHeader}>{layoutRightTitle}</div>
              {viewCategory === "정보" ? (
                <div className={styles.groupReviews}>
                  <table className={styles.userInfoTable}>
                    <tbody>
                      <tr>
                        <td>이메일</td>
                        <td>{user?.attributes?.email}</td>
                      </tr>
                      <tr>
                        <td>웹사이트 식별 아이디</td>
                        <td>{user?.attributes?.sub}</td>
                      </tr>
                      <tr>
                        <td>이메일 인증 여부</td>
                        <td>{(user?.attributes?.email_verified) ? "인증 완료" : "인증 필요"}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br></br>
                  <h3>비밀번호 변경</h3>
                  <AccountSettings.ChangePassword onSuccess={handleSuccess}/>
                </div>
              ) : viewCategory === "커뮤니티" ? (
                <div className={styles.groupReviews}>
                  {posts.map((post) => (
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
                              <div className={styles.sharp}>
                                #{post.post_id}
                              </div>
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
              ) : (
                <div className={styles.groupReviews}>
                  {reviews.map((review) => (
                    <Card key={review.review_id} className={styles.cardReview}>
                      <Card.Body className="text-start">
                        <>
                          <Card.Title
                            style={{
                              color: "#43A680",
                              display: "flex",
                              alignItems: "center",
                              width: "80%",
                            }}
                          >
                            {review.review_title}
                          </Card.Title>

                          <hr className={styles.divider}></hr>
                          <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                            <p
                              className="fw-semibold"
                              style={{ color: "grey" }}
                            >
                              수강학기: {review.taken_semyr}, 교수:{" "}
                              {review.instructor_name}
                            </p>

                            {review.review_content.replace(
                              /<br\s*[/]?>/gi,
                              "\n"
                            )}

                            <br></br>
                            <br></br>

                            <span>
                              <p
                                className="fw-bold"
                                style={{ display: "inline" }}
                              >
                                성적:{" "}
                              </p>
                              {review.grade}
                            </span>
                            <br></br>
                          </Card.Text>
                          <hr className="divider"></hr>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              className={styles.date}
                              style={{
                                fontSize: "16px",
                                opacity: 0.7,
                                marginRight: "auto",
                              }}
                            >
                              <span className={styles.sharp}>
                                #{review.review_id} {"  "}
                              </span>
                              <span className={styles.date}>
                                {review.review_time === null ? (
                                  ""
                                ) : (
                                  <>
                                    {new Date(
                                      new Date(review.review_time).getTime() +
                                        diffMSec
                                    ).toLocaleDateString()}{" "}
                                    작성
                                    {review.updated ? " (수정됨)" : ""}
                                  </>
                                )}
                                {"   "}
                                <Link
                                  to={`/courses/view/${review.course_id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  해당 리뷰로 이동
                                </Link>
                              </span>
                            </div>
                          </div>
                        </>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </PageView>
    </div>
  );
}

export default MyInfo;
