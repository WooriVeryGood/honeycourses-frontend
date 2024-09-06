import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import styles from "./AddReview.module.css";
import { semesters } from "../../constants/semesters";
import { useCourseName } from "../../API/reviews/useCourseName";
import Loader from "../../components/Loader/Loader";
import { useAddReview } from "../../API/reviews/useAddReview";

export default function AddReview() {
  const courseId = window.location.pathname.split("/").pop();
  const [review_title, setReviewTitle] = useState("");
  const [instructor_name, setInstructorName] = useState("");
  const [taken_semyr, setSemester] = useState("");
  const [grade, setGrade] = useState("");
  const [review_content, setReviewContent] = useState(
    "考核방식: \n\n任务量:\n\n평가: "
  );
  const [isSubmitted, setSubmit] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitted) return;
    setSubmit(true);
    createReview({
      courseId,
      reviewDetails: {
        review_title,
        instructor_name,
        taken_semyr,
        review_content,
        grade,
      },
    });
    setSubmit(false);
  };
  const { isLoading, course_name, error } = useCourseName(courseId);
  const { createReview } = useAddReview(courseId);
  const freshmanBoardId = "0";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  useEffect(() => {
    if (error) {
      navigate("/courses");
    }
  }, [error, navigate]);

  if (!course_name || isLoading) {
    return <Loader />;
  }

  return (
    <PageView>
      <Container fluid className={styles.addReviewBox}>
        <div>
          <div>
            <h2 className={styles.addReviewTitle}>
              수강 평가 작성: {" " + course_name}
            </h2>
          </div>
        </div>
        <div>
          <div>
            <p className={styles.addReviewCaution}>
              {courseId === freshmanBoardId
                ? "신입생 여러분, 북경대학교에 오신 걸 진심으로 환영합니다! 여기에 간단하게 인사말을 남겨주세요~"
                : "다른 학우들에게 도움이 될 수 있도록 밑의 양식대로 평가를 작성해주세요. 꼭 양식대로 작성할 필요는 없습니다. 비방, 욕설, 조롱,성적인 내용이 포함되어 있거나 도배/뻘글로 판단될 경우 관리자가 수강 평가를 삭제할 수 있습니다"}
            </p>
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
            <InputGroup.Text
              id="inputGroup-sizing-lg"
              style={{ flexWrap: "nowrap" }}
            >
              제목
            </InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={review_title}
              onChange={(event) => setReviewTitle(event.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
            <InputGroup.Text id="inputGroup-sizing-lg">
              {courseId === freshmanBoardId ? "소제목" : "교수"}
            </InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={instructor_name}
              onChange={(event) => setInstructorName(event.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
            <InputGroup.Text id="inputGroup-sizing-lg">
              {courseId === freshmanBoardId ? "입학 학기" : "수강 학기"}
            </InputGroup.Text>
            <Form.Select
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={taken_semyr}
              onChange={(event) => setSemester(event.target.value)}
              required
            >
              <option value="">
                {courseId === freshmanBoardId
                  ? "입학 학기 선택"
                  : "수강 학기 선택"}
              </option>
              {semesters.map((semyr, index) => {
                return (
                  <option key={index} value={semyr}>
                    {semyr}
                  </option>
                );
              })}
            </Form.Select>
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
            <InputGroup.Text id="inputGroup-sizing-lg">내용</InputGroup.Text>
            {courseId === freshmanBoardId ? (
              <Form.Control
                as="textarea"
                rows={10}
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                onChange={(event) => setReviewContent(event.target.value)}
                required
              />
            ) : (
              <Form.Control
                as="textarea"
                rows={10}
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                value={review_content}
                onChange={(event) => setReviewContent(event.target.value)}
                required
              />
            )}
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
            {courseId === freshmanBoardId ? (
              <></>
            ) : (
              <>
                <InputGroup.Text id="inputGroup-sizing-lg">
                  성적
                </InputGroup.Text>
                <Form.Control
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="선택사항. 退课했을 시 W로 적어주세요."
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                />
              </>
            )}
          </InputGroup>
          <div className="d-flex justify-content-end mt-4 mr-3">
            <Button variant="success" type="submit" disabled={isSubmitted}>
              제출
            </Button>
          </div>
        </Form>
      </Container>
    </PageView>
  );
}
