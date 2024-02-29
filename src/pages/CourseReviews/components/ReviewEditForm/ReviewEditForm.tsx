import { Form } from "react-bootstrap";
import { editReviewProps } from "../../../../types/editReview";
import { Review } from "../../../../types/review";
import { semesters } from "../../../../constants/semesters";

interface ReviewEditFormProps {
    review: Review;
  setEditedTitle: (title: string) => void;
  setEditedInstructor: (instructor: string) => void;
  setEditedSemyr: (semyr: string) => void;
  setEditedContent: (content: string) => void;
  setEditedGrade: (grade: string) => void;
  editedTitle: string;
  editedContent: string;
  editedInstructor: string;
  editedSemyr: string;
  editedGrade: string;
}

export default function ReviewEditForm(
  {
    review,
    setEditedTitle,
    setEditedInstructor,
    setEditedSemyr,
    setEditedContent,
    setEditedGrade,
    editedTitle,
    editedContent,
    editedInstructor,
    editedSemyr,
    editedGrade,
  }: ReviewEditFormProps,
) {
  return (
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
        {semesters.map((semyr, index) => {
            return <option key={index} value={semyr}>{semyr}</option>
        })}
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
  );
}
