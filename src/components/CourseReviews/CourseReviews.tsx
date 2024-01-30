import { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import styles from "./CourseReviews.module.css";
import { Form } from "react-bootstrap";
import { apiDelete, apiGet, apiPut } from "../API/APIHandler";
import { reverse } from "dns";

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [course_name, setCourseName] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedInstructor, setEditedInstructor] = useState("");
  const [editedSemyr, setEditedSemyr] = useState("");
  const [editedGrade, setEditedGrade] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const courseId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [isShowMore, setShowMore] = useState(false);
  const [showMoreReviewId, setShowMoreReviewId] = useState<number | null>(null);

  const dateA = new Date("2022/06/01 08:00:00");
  const dateB = new Date("2022/06/01 00:00:00");
  const diffMSec = dateA.getTime() - dateB.getTime();

  const handleUpvote = async (reviewId: number) => {
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
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error updating review like status:", error);
    }
  };

  const submitEdit = async (reviewId: number) => {
    if (isEditing) return;

    setIsEditing(true);
    try {
      const response = await apiPut(`/courses/reviews/${reviewId}`, {
        review_title: editedTitle,
        review_content: editedContent,
        instructor_name: editedInstructor,
        taken_semyr: editedSemyr,
        grade: editedGrade,
      });

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
                instructor_name: editedInstructor,
                taken_semyr: editedSemyr,
                grade: editedGrade,
              }
              : review
          )
        );
      }
      setIsEditing(false);
      setShowMore(!isShowMore);
      setShowMoreReviewId(reviewId); // 리뷰 수정 후 리뷰 더보기 버튼 수납
    } catch (error) {
      console.error("Error updating review:", error);
      alert("리뷰 수정에 실패했습니다.");
      setIsEditing(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      try {
        await apiDelete(`/courses/reviews/${reviewId}`);
        alert("리뷰가 삭제되었습니다.");
        setReviews(reviews.filter((review) => review.review_id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("리뷰 삭제에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        setIsLoading(true);
        Promise.all([
          apiGet(`/courses/${courseId}/reviews`),
          apiGet(`/courses/${courseId}/name`),
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
            if (error.response.data.message === "강의를 찾을 수 없습니다." && error.response.status === 404) {
              navigate("/courses");
              alert("존재하지 않는 수업입니다.");
            }
            setIsLoading(false);
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
                    <div
                      className={styles.reviewButtons}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <Button
                        className={styles.showMoreButton}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        onClick={() => {
                          setShowMore(!isShowMore);
                          setShowMoreReviewId(review.review_id);
                        }}
                      >
                        <img
                          src="/images/showMoreButton.png"
                          alt="show-more-icon"
                        />
                      </Button>
                      <div
                        className={
                          isShowMore && showMoreReviewId === review.review_id
                            ? styles.reviewChangeDelete
                            : styles.hiddenReviewChangeDelete
                        }
                      >
                        <Button
                          className={styles.ReviewChange}
                          variant="success"
                          onClick={() => {
                            setEditingReviewId(review.review_id);
                            setEditedTitle(review.review_title);
                            setEditedContent(review.review_content);
                            setEditedSemyr(review.taken_semyr);
                            setEditedInstructor(review.instructor_name);
                            setEditedGrade(review.grade);
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
                      type="text"
                      value={editedInstructor}
                      onChange={(e) => setEditedInstructor(e.target.value)}
                      placeholder="교수"
                      className="mb-2"
                      required
                    />
                    <Form.Select
                      value={editedSemyr}
                      as="textarea"
                      rows={10}
                      onChange={(e) => setEditedSemyr(e.target.value)}
                      placeholder="수강 학기"
                      required
                    >
                      <option value="">수강 학기 선택</option>
                      <option value="17-18년도 1학기">17-18년도 1학기</option>
                      <option value="17-18년도 2학기">17-18년도 2학기</option>
                      <option value="17-18년도 3학기/계절학기">
                        17-18년도 3학기/계절학기
                      </option>
                      <option value="18-19년도 1학기">18-19년도 1학기</option>
                      <option value="18-19년도 2학기">18-19년도 2학기</option>
                      <option value="18-19년도 3학기/계절학기">
                        18-19년도 3학기/계절학기
                      </option>
                      <option value="19-20년도 1학기">19-20년도 1학기</option>
                      <option value="19-20년도 2학기">19-20년도 2학기</option>
                      <option value="19-20년도 3학기/계절학기">
                        19-20년도 3학기/계절학기
                      </option>
                      <option value="20-21년도 1학기">20-21년도 1학기</option>
                      <option value="20-21년도 2학기">20-21년도 2학기</option>
                      <option value="20-21년도 3학기/계절학기">
                        20-21년도 3학기/계절학기
                      </option>
                      <option value="21-22년도 1학기">21-22년도 1학기</option>
                      <option value="21-22년도 2학기">21-22년도 2학기</option>
                      <option value="21-22년도 3학기/계절학기">
                        21-22년도 3학기/계절학기
                      </option>
                      <option value="22-23년도 1학기">22-23년도 1학기</option>
                      <option value="22-23년도 2학기">22-23년도 2학기</option>
                      <option value="22-23년도 3학기/계절학기">
                        22-23년도 3학기/계절학기
                      </option>
                      <option value="23-24년도 1학기">23-24년도 1학기</option>
                    </Form.Select>
                    <br />
                    <Form.Control
                      value={editedContent}
                      as="textarea"
                      rows={10}
                      onChange={(e) => setEditedContent(e.target.value)}
                      placeholder="내용"
                      required
                    ></Form.Control>
                    <Form.Control
                      value={editedGrade}
                      as="textarea"
                      rows={1}
                      onChange={(e) => setEditedGrade(e.target.value)}
                      placeholder="성적"
                      required
                    ></Form.Control>
                    <br />
                    <div style={{ width: "65%", height: "50px" }}>
                      {review.mine && (
                        <div
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }}
                        ></div>
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
                        width: "80%",
                      }}
                    >
                      {review.review_title}
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
                        <span className={styles.sharp}>#{review.review_id} {"  "}</span>
                        <span className={styles.date}>{review.review_time === null ? (
                          ""
                        ) : (
                          <>
                            {new Date(
                              new Date(review.review_time).getTime() + diffMSec
                            ).toLocaleDateString()}{" "}
                            작성
                            {review.updated ? " (수정됨)" : ""}
                          </>
                        )}
                        </span>
                      </div>
                      <div
                        onClick={() => handleUpvote(review.review_id)}
                        className={
                          review.liked ? styles.onLikeButton : styles.likeButton
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={
                            review.liked
                              ? "/images/likeGreen.svg"
                              : "/images/likeWhiteSolidBlack.svg"
                          }
                          alt="likes-icon"
                          style={{
                            marginRight: "5px",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        <span
                          className={
                            review.liked ? styles.likeCount : styles.none
                          }
                        >
                          {review.like_count}
                        </span>
                      </div>
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
