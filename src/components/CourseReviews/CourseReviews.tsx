import { useState, useEffect } from "react";
import axios from "axios";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify';
import styles from "./CourseReviews.module.css";

// 수업 리뷰 디스플레이 컴포넌트 (https://honeycourses.com/course/view/수업ID)

interface Review {
  review_title: string;
  review_id: number;
  review_content: string;
  review_point: number;
  course_name: string;
  voted: boolean;
  instructor_name: string;
  taken_semyr: string;
  grade: string;
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
  
    const updatedReviews = reviews.map((review) => {
      if (review.review_id === reviewId) {
        return {
          ...review,
          review_point: review.review_point + 1,
        };
      } else {
        return review;
      }
    });
  
    setReviews(updatedReviews);
    try {
      await axios.post(`${apiUrl}/courses/${courseId}/reviews/${reviewId}`, {
        reviewPoint: updatedReviews.find(
          (review) => review.review_id === reviewId
        )?.review_point,
      }, { headers });
      localStorage.setItem(`${reviewId}`, "vote");
    } catch (error) {
      console.error('Error upvoting review:', error);
    }
  };
  
  const handleDownvote = async (reviewId: number) => {
    const jwtToken = await getCognitoToken();
    if (!jwtToken) {
      console.error("Cognito token not available");
      return;
    }
  
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
  
    const updatedReviews = reviews.map((review) => {
      if (review.review_id === reviewId) {
        return {
          ...review,
          review_point: review.review_point - 1,
        };
      } else {
        return review;
      }
    });
  
    setReviews(updatedReviews);
    try {
      await axios.post(`${apiUrl}/courses/${courseId}/reviews/${reviewId}`, {
        reviewPoint: updatedReviews.find(
          (review) => review.review_id === reviewId
        )?.review_point,
      }, { headers });
      localStorage.setItem(`${reviewId}`, "vote");
    } catch (error) {
      console.error('Error downvoting review:', error);
    }
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
            setCourseName(nameResponse.data[0].course_name);
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
          <h2 className={styles.courseName} style={{ margin: "0 10px" }}>{course_name}</h2>

          {reviews.length > 0 && (
            <Button
              className="my-auto"
              href={`/courses/addReview/${courseId}`}
              variant="success"
              size="sm"
              style={{ marginTop: "1%", marginLeft: "1rem", backgroundColor:"#43A680",  borderColor:"#43A680" }}
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
            <Card
              key={review.review_id}
              className={styles.reviewCard}
            >
              <Card.Body className="text-start">
                <Card.Title style={{ color: "#43A680" }}>
                  {review.review_title}
                </Card.Title>
                <hr className="divider"></hr>
                <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                <p className="fw-semibold" style={{color:"grey"}}>수강학기: {review.taken_semyr}, 교수: {review.instructor_name}</p>
                
                  {review.review_content.replace(/<br\s*[/]?>/gi, "\n")}

                  <br></br><br></br>
                  <span style={{ whiteSpace: "nowrap" }}><p className="fw-bold" style={{ display: "inline" }}>성적: </p>{review.grade}</span>
                 
                </Card.Text>
                <hr className="divider"></hr>
                <ButtonGroup aria-label="Basic example" className="float-end">
                  <Button
                    variant="success"
                    onClick={() => handleUpvote(review.review_id)}
                    disabled={
                      localStorage.getItem(`${review.review_id}`) != null
                    } 
                  >
                    추천
                  </Button>
                  <span style={{ margin: "0 10px" }}>
                    {review.review_point}
                  </span>
                  <Button
                    variant="danger"
                    onClick={() => handleDownvote(review.review_id)}
                    disabled={
                      localStorage.getItem(`${review.review_id}`) != null
                    } 
                  >
                    비추
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </PageView>
  );
}
