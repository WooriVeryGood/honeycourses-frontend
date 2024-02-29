import { useEffect } from "react";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import styles from "./CourseReviews.module.css";
import { useReviews } from "../../API/reviews/useReviews";
import Loader from "../../components/Loader/Loader";
import ReviewCard from "./components/ReviewCard/ReviewCard";
import { Review } from "../../types/review";

// 수업 리뷰 디스플레이 컴포넌트 (https://honeycourses.com/course/view/수업ID)

export default function CourseReviews() {
  const courseId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const { isLoading, error, reviews, course_name } = useReviews(courseId);

  const addReviewClick = () => {
    navigate(`/courses/addReview/${courseId}`);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  useEffect(() => {
    if (error) {
      navigate("/courses");
    }
  }, [error, navigate]);

  if (!reviews || isLoading) {
    return <Loader />;
  }

  return (
    <PageView>
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
            onClick={addReviewClick}
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
              onClick={addReviewClick}
              variant="success"
              size="sm"
              style={{ marginTop: "20px" }}
            >
              첫 리뷰를 작성해보세요!
            </Button>
          </div>
        ) : (
          reviews.map((review: Review) => (
            <ReviewCard courseId={courseId} review={review}/>
          ))
        )}
      </Container>
    </PageView>
  );
}
