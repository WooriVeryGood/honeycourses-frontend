import { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import styles from "./CourseReviews.module.css";
import { Form } from "react-bootstrap";
import { apiDelete, apiGet, apiPut } from "../../API/APIHandler";
import { useReviews } from "../../API/reviews/useReviews";
import Loader from "../../components/Loader/Loader";
import { useEditReview } from "../../API/reviews/useEditReview";
import ReviewCard from "./components/ReviewCard/ReviewCard";

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
  updated: boolean;
}

export default function CourseReviews() {
  const courseId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();

  /*const handleUpvote = async (reviewId: number) => {
    try {
      const response = await apiPut(`/courses/reviews/${reviewId}/like`, null);
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
      //setReviews(updatedReviews);
    } catch (error) {
      console.error("Error updating review like status:", error);
    }
  };*/

  const addReviewClick = () => {
    navigate(`/courses/addReview/${courseId}`);
  }

  const { isLoading, error, reviews, course_name } = useReviews(courseId);

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
