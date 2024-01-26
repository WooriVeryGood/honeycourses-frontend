import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Auth } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import styles from "./AddReview.module.css";
import { headers } from "../API/Headers";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AddReview() {
  const courseId = window.location.pathname.split("/").pop();
  const { user } = useAuthenticator((context) => [context.user]);
  const [review_title, setReviewTitle] = useState("");
  const [course_name, setCourseName] = useState("");
  const [instructor_name, setInstructorName] = useState("");
  const [taken_semyr, setSemester] = useState("");
  const [grade, setGrade] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [review_content, setReviewContent] = useState(
    "考核방식: \n\n任务量:\n\n평가: "
  );
  const [isSubmitted, setSubmit] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitted) {
      setSubmit(true);
      const userSession = await Auth.currentSession();
      const jwtToken = userSession.getAccessToken().getJwtToken();


      const data = {
        review_title,
        instructor_name,
        taken_semyr,
        review_content,
        grade,
      };
      axios
        .post(`${apiUrl}/courses/${courseId}/reviews`, data,  headers )
        .then((response) => {
          console.log(response.data);
          alert("리뷰 등록에 성공했습니다!");
          setSubmit(false);
          navigate(`/courses/view/${courseId}`);
        })
        .catch((error) => {
          console.log(error);
          setSubmit(false);
        });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/courses/${courseId}/name`)
      .then((nameResponse) => {
        setCourseName(nameResponse.data[0].course_name);
        setIsLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          navigate("/courses");
          alert("존재하지 않는 수업입니다.");
        }
        console.error(error);
        setIsLoading(false);
        window.scrollTo(0, 0);
        return <h1>데이터베이스 오류가 발생했습니다.</h1>;
      });
  }, [courseId, navigate]);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className={styles.addReviewBox}>
        <div>
          <div>
            <h2 className={styles.addReviewTitle}>수강 평가 작성 {course_name}</h2>
          </div>
        </div>
        <div>
          <div>
            <p className={styles.addReviewCaution}>
              다른 학우들에게 도움이 될 수 있도록 밑의 양식대로 평가를
              작성해 주세요. 꼭 양식대로 작성할 필요는 없습니다. 비방, 욕설,
              조롱, 성적인 내용이 포함되어 있거나 도배/뻘글로 판단될 경우
              관리자가 수강 평가를 삭제할 수 있습니다
            </p>
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap:"nowrap"}}>
            <InputGroup.Text id="inputGroup-sizing-lg" style={{ flexWrap:"nowrap"}}>제목</InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={review_title}
              onChange={(event) => setReviewTitle(event.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap:"nowrap"}}>
            <InputGroup.Text id="inputGroup-sizing-lg">교수</InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={instructor_name}
              onChange={(event) => setInstructorName(event.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap:"nowrap"}}>
            <InputGroup.Text id="inputGroup-sizing-lg">
              수강 학기
            </InputGroup.Text>
            <Form.Select
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={taken_semyr}
              onChange={(event) => setSemester(event.target.value)}
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
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap:"nowrap"}}>
            <InputGroup.Text id="inputGroup-sizing-lg">내용</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows={10}
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={review_content}
              onChange={(event) => setReviewContent(event.target.value)}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap:"nowrap"}}>
            <InputGroup.Text id="inputGroup-sizing-lg">성적</InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="선택사항. 退课했을 시 W로 적어주세요."
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
            />
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
