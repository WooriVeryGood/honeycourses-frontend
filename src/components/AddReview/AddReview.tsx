import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const apiUrl = process.env.REACT_APP_API_URL;

// @todo 제출후 원래페이지 돌아가 성공 여부 표시

export default function AddReview() {
  const courseId = window.location.pathname.split("/").pop();
  const [reviewTitle, setReviewTitle] = useState("");
  const [course_name, setCourseName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviewContent, setReviewContent] = useState(
    "수강 학기: 2x-2x학년도 ?학기\n\n교수: XXX\n\n평가: \n\n별점 평가: ?★★★★★점"
  );
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      reviewTitle,
      reviewContent,
    };
    axios
      .post(`${apiUrl}/courses/${courseId}/reviews`, data)
      .then((response) => {
        console.log(response.data);
        alert("리뷰 등록에 성공했습니다!");
        navigate(`/courses/view/${courseId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${apiUrl}/courses/${courseId}/name`)
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

  }, [courseId, navigate])


  return (
    <PageView isLoading={isLoading}>
      <Container fluid className="justify-content-center align-items-center">
        <Row>
          <Col xs={8}>
            <h2 style={{ marginLeft: "14%" }}>수강평가 작성: {course_name}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <p className="fw-light" style={{ marginLeft: "14%" }}>
              주의: 다른 학우들에게 도움이 될수 있도록 밑의 양식대로 평가를
              작성해주세요. 꼭 양식대로 작성할 필요는 없습니다. 비방, 욕설,
              조롱, 성적인 내용이 포함되어 있거나 도배/뻘글로 판단될 경우 관리자가
              수강평가를 삭제할 수 있습니다
              <div className=""></div>
            </p>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text id="inputGroup-sizing-lg">제목</InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={reviewTitle}
              onChange={(event) => setReviewTitle(event.target.value)}
            />
          </InputGroup>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text id="inputGroup-sizing-lg">내용</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows={10}
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={reviewContent}
              onChange={(event) => setReviewContent(event.target.value)}
            />
          </InputGroup>
          <div className="d-flex justify-content-end mt-4 mr-3">
            <Button variant="success" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Container>
    </PageView>
  );
}
