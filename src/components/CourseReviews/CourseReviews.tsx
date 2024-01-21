import { useState, useEffect } from "react";
import axios from "axios";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import styles from "./CourseReviews.module.css";

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
}

const apiUrl = process.env.REACT_APP_API_URL;

export default function CourseReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [course_name, setCourseName] = useState("");
  const courseId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();

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

          {reviews.length > 0 && (
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
                alt="github-icon"
              />
              평가 작성
            </Button>
          )}
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
              <Card.Body className="text-start">
                <Card.Title style={{ color: "#43A680" }}>
                  {review.review_title}
                </Card.Title>
                <hr className="divider"></hr>
                <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                  <p className="fw-semibold" style={{ color: "grey" }}>
                    수강학기: {review.taken_semyr}, 교수:{" "}
                    {review.instructor_name}
                  </p>

                  {review.review_content.replace(/<br\s*[/]?>/gi, "\n")}

                  <br></br>
                  <br></br>

                  <span style={{ whiteSpace: "nowrap" }}>
                    <p className="fw-bold" style={{ display: "inline" }}>
                      성적:{" "}
                    </p>
                    {review.grade}
                  </span>
                  <br></br>
                </Card.Text>
                <hr className="divider"></hr>
                <Button
                  className="float-end"
                  variant="success"
                  onClick={() => handleUpvote(review.review_id)}
                  disabled={localStorage.getItem(`${review.review_id}`) != null}
                  style={{ opacity: review.liked ? 0.7 : 1 }}
                >
                  {review.liked ? "추천 취소 " : "추천 "}
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
                <div className={styles.date} style={{fontSize: "16px", opacity: 0.7}}>
                  {review.review_time === null ? (
                    "24년 1월 전에 작성된 리뷰입니다."
                  ) : (
                    <>
                      {new Date(review.review_time).toLocaleDateString()}{" "} 작성
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </PageView>
  );
}
