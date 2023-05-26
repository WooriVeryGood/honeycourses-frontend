import "./CourseReviews.css";
import { useState, useEffect } from "react";
import axios from "axios";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { useLocation } from "react-router-dom";


// 수업 리뷰 디스플레이 컴포넌트 (https://honeycourses.com/course/view/수업ID)

interface Review {
  review_title: string;
  review_id: number;
  review_content: string;
  review_point: number;
  // course_name: string;
  voted: boolean; 
}

const apiUrl = process.env.REACT_APP_API_URL;

export default function CourseReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const courseId = window.location.pathname.split("/").pop();
  const location = useLocation();
  const { courseName } = location.state;


  const handleUpvote = (reviewId: number) => {
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
    axios.post(`${apiUrl}/courses/${courseId}/reviews/${reviewId}`, {
      reviewPoint: updatedReviews.find(
        (review) => review.review_id === reviewId
      )?.review_point,
    });
    localStorage.setItem(`${reviewId}`, "vote");
  };

  const handleDownvote = (reviewId: number) => {
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
    axios.post(`${apiUrl}/courses/${courseId}/reviews/${reviewId}`, {
      reviewPoint: updatedReviews.find(
        (review) => review.review_id === reviewId
      )?.review_point,
    });
    localStorage.setItem(`${reviewId}`, "vote");
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/courses/${courseId}/reviews`)
      .then((response) => {
        // Initialize the 'voted' property for each review
        const initializedReviews = response.data.map((review: Review) => ({
          ...review,
        }));
        setReviews(initializedReviews);
        console.log(initializedReviews);
        setIsLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        window.scrollTo(0, 0);
        return <h1>데이터베이스 오류가 발생했습니다.</h1>;
      });
  }, [courseId]);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className="justify-content-center align-items-start">
        <Row>
          <Col xs={5}>
            <h2 style={{ marginLeft: "15%" }}>{courseName}</h2>
          </Col>
          <Col xs={7}>
            {reviews.length > 0 && (
              <Button
                href={`/courses/addReview/${courseId}`}
                variant="success"
                size="sm"
                style={{ marginTop: "1%", marginLeft: "2%" }}
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
          </Col>
        </Row>

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
              style={{ width: "90%", marginBottom: "30px" }}
              key={review.review_id}
              className={`mx-auto ${review.review_point < 0 ? "text-muted" : ""
                }`}
            >
              <Card.Body className="text-start">
                <Card.Title>{review.review_title}</Card.Title>
                <hr className="divider"></hr>
                <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                  {review.review_content.replace(/<br\s*[/]?>/gi, "\n")}

                  <br />
                  <br />
                </Card.Text>
                <hr className="divider"></hr>
                <ButtonGroup aria-label="Basic example" className="float-end">
                  <Button
                    variant="success"
                    onClick={() => handleUpvote(review.review_id)}
                    disabled={localStorage.getItem(`${review.review_id}`) != null} // Disable the button if the review has been voted on
                  >
                    추천
                  </Button>
                  <span style={{ margin: "0 10px" }}>
                    {review.review_point}
                  </span>
                  <Button
                    variant="danger"
                    onClick={() => handleDownvote(review.review_id)}
                    disabled={localStorage.getItem(`${review.review_id}`) != null} // Disable the button if the review has been voted on
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
