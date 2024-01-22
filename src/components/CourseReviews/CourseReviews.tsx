import { useState, useEffect } from "react";
import axios from "axios";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import styles from "./CourseReviews.module.css";
import { Badge, Form } from "react-bootstrap";

// 수업 리뷰 디스플레이 컴포넌트 (https://honeycourses.com/course/view/수업ID)

interface Review {
  review_title: string;
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
}

const apiUrl = process.env.REACT_APP_API_URL;

export default function CourseReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [course_name, setCourseName] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const courseId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [isShowMore,setShowMore] = useState(false);
  const [showMoreReviewId,setShowMoreReviewId]=useState<number | null>(null);

  const handleUpvote = async (reviewId: number) => {
    const jwtToken = await getCognitoToken();
    if (!jwtToken) {
      console.error("Cognito token not available");
      return;
    }
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
    try {
      const response = await axios.put(
        `${apiUrl}/courses/reviews/${reviewId}/like`,
        {},
        { headers }
      );
      const updatedReviewData = response.data;
      const updatedReviews = reviews.map((review) => {
        if (review.review_id === reviewId) {
          return {
            ...review,
            like_count: updatedReviewData.like_count,
            liked: updatedReviewData.liked,
          };
        } else {
          return review;
        }
      });
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error updating review like status:", error);
    }
  };

  const submitEdit = async (reviewId: number) => {
    if (isEditing) return;

    setIsEditing(true);
    try {
      const jwtToken = await getCognitoToken();
      if (!jwtToken) {
        console.error("Cognito token not available");
        return;
      }

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const response = await axios.put(
        `${apiUrl}/courses/reviews/${reviewId}`,
        {
          review_title: editedTitle,
          review_content: editedContent,
        },
        { headers }
      );

      if (response.data) {
        alert("리뷰가 수정되었습니다.");
        setEditingReviewId(null);
        setReviews(
          reviews.map((review) =>
            review.review_id === reviewId
              ? {
                ...review,
                review_title: editedTitle,
                review_content: editedContent,
              }
              : review
          )
        );
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating review:", error);
      alert("리뷰 수정에 실패했습니다.");
      setIsEditing(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      try {
        const jwtToken = await getCognitoToken();
        if (!jwtToken) {
          console.error("Cognito token not available");
          return;
        }

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        await axios.delete(`${apiUrl}/courses/reviews/${reviewId}`, {
          headers,
        });

        alert("리뷰가 삭제되었습니다.");
        setReviews(reviews.filter((review) => review.review_id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("리뷰 삭제에 실패했습니다.");
      }
    }
  };

  // const onClickShowMore = ()=>{
  //   setShowMore(!isShowMore);
  //   setEditingReviewId(review.review_id)
  // };

  const getCognitoToken = async () => {
    try {
      const userSession = await Auth.currentSession();
      return userSession.getAccessToken().getJwtToken();
    } catch (error) {
      console.error("Error getting Cognito token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const jwtToken = await getCognitoToken();
        if (!jwtToken) {
          console.error("Cognito token not available");
          setIsLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        Promise.all([
          axios.get(`${apiUrl}/courses/${courseId}/reviews`, { headers }),
          axios.get(`${apiUrl}/courses/${courseId}/name`, { headers }),
        ])
          .then(([reviewsResponse, nameResponse]) => {
            const initializedReviews = reviewsResponse.data.map(
              (review: Review) => ({
                ...review,
              })
            );
            setReviews(initializedReviews);
            setCourseName(nameResponse.data.course_name);
            setIsLoading(false);
            window.scrollTo(0, 0);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              navigate("/courses");
              alert("존재하지 않는 수업입니다.");
            }
            console.error("API error:", error);
            setIsLoading(false);
            window.scrollTo(0, 0);
            return <h1>데이터베이스 오류가 발생했습니다.</h1>;
          });
      } catch (error) {
        console.error("Error in fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchDataFromApi();
  }, [courseId, navigate]);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className="justify-content-center align-items-start">
        <div
          className={styles.courseReviewHeader}
          style={{ marginBottom: "15px" }}
        >
          <h2 className={styles.courseName} style={{ margin: "0 10px" }}>
            {course_name}
          </h2>

          <Button
            className="my-auto"
            href={`/courses/addReview/${courseId}`}
            variant="success"
            size="sm"
            style={{
              marginTop: "1%",
              marginLeft: "1rem",
              backgroundColor: "#43A680",
              borderColor: "#43A680",
            }}
          >
            <img
              src="/images/plus.svg"
              className="bi"
              width="23"
              height="23"
              alt="add-icon"
            />
            평가 작성
          </Button>
        </div>

        {reviews.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h3>아직 작성된 리뷰가 없습니다.</h3>
            <Button
              href={`/courses/addReview/${courseId}`}
              variant="success"
              size="sm"
              style={{ marginTop: "20px" }}
            >
              첫 리뷰를 작성해보세요!
            </Button>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.review_id} className={styles.reviewCard}>
              {review.mine && (
                <div>
                  {editingReviewId === review.review_id ? (
                    <div className={styles.editButtons}>
                      <Button
                        variant="primary"
                        onClick={() => submitEdit(review.review_id)}
                        disabled={isEditing}
                      >
                        제출
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingReviewId(null)}
                      >
                        취소
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.reviewButtons} style={{ position: "absolute", top: "10px", right: "10px" }}>
                      <Button
                        className={styles.showMoreButton}
                        style={{ backgroundColor: "transparent", border: "none" }}
                        onClick={()=>{
                          setShowMore(!isShowMore);
                          setShowMoreReviewId(review.review_id)
                        }}
                      >
                        <img
                          src="/images/showMoreButton.png"
                          alt="show-more-icon"
                        />
                      </Button>
                      <div className={isShowMore&&showMoreReviewId===review.review_id? styles.reviewChangeDelete:styles.hiddenReviewChangeDelete}>
                        <Button
                          className={styles.ReviewChange}
                          variant="success"
                          onClick={() => {
                            setEditingReviewId(review.review_id);
                            setEditedTitle(review.review_title);
                            setEditedContent(review.review_content);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          className={styles.reviewDelete}
                          variant="danger"
                          onClick={() => handleDeleteReview(review.review_id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Card.Body className="text-start">
                {editingReviewId === review.review_id ? (
                  <>
                    <Form.Control
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="제목"
                      className="mb-2"
                      required
                    />
                    <Form.Control
                      value={editedContent}
                      as="textarea"
                      rows={10}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="내용"
                      required
                    ></Form.Control>
                    <div
                    style={{width:"65%",height:"50px"}}
                    >
                      {review.mine && (
                <div
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                </div>
              )}
                    </div>
                  </>
                ) : (
                  // Display Mode
                  <>
                    <Card.Title
                      style={{
                        color: "#43A680",
                        display: "flex",
                        alignItems: "center",
                        width:"80%",
                      }}
                    >
                      {review.review_title}
                      
                      
                      {/* 필요한가? */}
                      {/* <span style={{ marginLeft: "5px" }}></span>{" "}
                      {review.mine ? (
                        <Badge
                          className="rounded-pill"
                          bg="#FF7BA9"
                          style={{
                            backgroundColor: "#489CC1",
                            marginLeft: "10px",
                          }} // Adjust marginLeft for spacing
                        >
                          내가 작성한 리뷰
                        </Badge>
                      ) : null} */}
                    </Card.Title>

                    <hr className={styles.divider}></hr>
                    <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                      <p className="fw-semibold" style={{ color: "grey" }}>
                        수강학기: {review.taken_semyr}, 교수:{" "}
                        {review.instructor_name}
                      </p>

                      {review.review_content.replace(/<br\s*[/]?>/gi, "\n")}

                      <br></br>
                      <br></br>

                      <span>
                        <p className="fw-bold" style={{ display: "inline" }}>
                          성적:{" "}
                        </p>
                        {review.grade}
                      </span>
                      <br></br>
                    </Card.Text>
                    <hr className="divider"></hr>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        className={styles.date}
                        style={{
                          fontSize: "16px",
                          opacity: 0.7,
                          marginRight: "auto",
                        }}
                      >
                        {review.review_time === null ? (
                          "24년 1월 전에 작성된 리뷰입니다."
                        ) : (
                          <>
                            {new Date(review.review_time).toLocaleDateString()}{" "}
                            작성
                          </>
                        )}
                      </div>
                      <Button
                        className="float-end"
                        variant="success"
                        onClick={() => handleUpvote(review.review_id)}
                        style={{ opacity: review.liked ? 0.7 : 1 }}
                      >
                        {/* {review.liked ? "추천 취소 " : "추천 "} */}
                        <img
                          src="/images/likeWhite.svg"
                          alt="likes-icon"
                          style={{
                            marginRight: "5px",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        {review.like_count}
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </PageView>
  );
}
