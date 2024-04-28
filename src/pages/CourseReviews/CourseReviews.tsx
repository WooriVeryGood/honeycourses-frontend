import { useEffect, useState } from "react";
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
  const { isLoading, reviews, course_name, noRecentReviews } =
    useReviews(courseId);

  const addReviewClick = () => {
    navigate(`/courses/addReview/${courseId}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(noRecentReviews);
  }, [courseId]);

  if (isLoading) {
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

          {!noRecentReviews && (
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
          )}
        </div>

        {noRecentReviews ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>
              최근 6개월간 작성한 리뷰가 없습니다. <br />
              (ㅠ﹏ㅠ)
            </h2>
            <p>
              답변 받았습니다! 의 강의평가 기능은 여러분의 적극적인 기여로
              만들어지고 있습니다. <br />
              여러분의 소중한 리뷰 하나가, 다른 학우분들의 한학기에 큰 도움이 될
              수 있습니다.
              <br />
              <br />
              더욱 많은 학우분들이 도움 받을 수 있도록, 6개월간 최소 1개의
              리뷰를 작성해야 <br />
              리뷰 열람이 가능하도록 제한하고 있습니다.
              <br />
            </p>
            <Button
              onClick={addReviewClick}
              variant="success"
              size="sm"
              style={{ marginTop: "20px" }}
            >
              답변, 나눠주세요!
            </Button>
          </div>
        ) : reviews?.length === 0 ? (
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
          reviews?.map((review: Review,i: number) => (
            <ReviewCard courseId={courseId} review={review} key={i} />
          ))
        )}
      </Container>
    </PageView>
  );
}
