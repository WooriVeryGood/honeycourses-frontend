import { Button, Card, Form } from "react-bootstrap";
import { Review } from "../../../../types/review";
import styles from "./ReviewCard.module.css";
import { useState } from "react";
import { useEditReview } from "../../../../API/reviews/useEditReview";
import ReviewEditForm from "../ReviewEditForm/ReviewEditForm";
import { useDeleteReview } from "../../../../API/reviews/useDeleteReview";
import { useVoteReview } from "../../../../API/reviews/useVoteReview";

interface ReviewCardProps {
  courseId: string | undefined;
  review: Review;
}

export default function ReviewCard({ courseId, review }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedInstructor, setEditedInstructor] = useState("");
  const [editedSemyr, setEditedSemyr] = useState("");
  const [editedGrade, setEditedGrade] = useState("");
  const [isShowMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { editSingleReview } = useEditReview();
  const { deleteSingleReview } = useDeleteReview();
  const { voteSingleReview } = useVoteReview();

  const dateA = new Date("2022/06/01 08:00:00");
  const dateB = new Date("2022/06/01 00:00:00");
  const diffMSec = dateA.getTime() - dateB.getTime();

  return (
    <Card key={review.review_id} className={styles.reviewCard}>
      {true && (
        <div>
          {isEditing ? (
            <div className={styles.editButtons}>
              <Button
                variant="primary"
                onClick={() => {
                  setIsSubmitting(true);
                  editSingleReview({
                    reviewId: review.review_id,
                    courseId,
                    editedTitle,
                    editedContent,
                    editedInstructor,
                    editedSemyr,
                    editedGrade,
                  });
                  setIsSubmitting(false);
                  setShowMore(!isShowMore);
                  setIsEditing(false);
                }}
                disabled={isSubmitting}
              >
                제출
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
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
                variant="secondary"
                className={styles.showMoreButton}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                }}
                onClick={() => {
                  setShowMore(!isShowMore);
                }}
              >
                <img src="/images/showMoreButton.png" alt="show-more-icon" />
              </Button>
              <div
                className={
                  isShowMore
                    ? styles.reviewChangeDelete
                    : styles.hiddenReviewChangeDelete
                }
              >
                <Button
                  className={styles.ReviewChange}
                  variant="success"
                  onClick={() => {
                    setIsEditing(true);
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
                  onClick={() => {
                    deleteSingleReview({
                      courseId,
                      reviewId: review.review_id,
                    });
                  }}
                >
                  삭제
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <Card.Body className="text-start">
        {isEditing ? (
          // 수정중
          <ReviewEditForm
            review={review}
            setEditedTitle={setEditedTitle}
            setEditedInstructor={setEditedInstructor}
            setEditedSemyr={setEditedSemyr}
            setEditedContent={setEditedContent}
            setEditedGrade={setEditedGrade}
            editedTitle={editedTitle}
            editedContent={editedContent}
            editedInstructor={editedInstructor}
            editedSemyr={editedSemyr}
            editedGrade={editedGrade}
          />
        ) : (
          // 리뷰 표시
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
                수강학기: {review.taken_semyr}, 교수: {review.instructor_name}
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
                <span className={styles.sharp}>
                  #{review.review_id} {"  "}
                </span>
                <span className={styles.date}>
                  {review.review_time === null ? (
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
                onClick={() => {
                  voteSingleReview({courseId, reviewId: review.review_id})
                }}
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
                <span className={review.liked ? styles.likeCount : styles.none}>
                  {review.like_count}
                </span>
              </div>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
