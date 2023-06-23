import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AddCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseCredit, setCourseCredit] = useState("");
  const [courseCategory, setCourseCat] = useState("");
  const [youGuanStat, setYouGuanStat] = useState(0);

  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      courseName,
      courseCredit,
      courseCategory,
      youGuanStat,
    };
    axios
      .post(`${apiUrl}/courses`, data)
      .then((response) => {
        console.log(response.data);
        alert("수업 등록에 성공했습니다!");
        navigate(`/courses`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <PageView>
      <Container fluid className="justify-content-center align-items-center">
        <Row>
          <Col xs={8}>
            <h2 style={{ marginLeft: "14%" }}>강의 추가</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <p className="fw-light" style={{ marginLeft: "14%" }}>
              주의: 강의를 추가할때는 꼭 수업명을 줄이지 않고 选课系统에
              뜨는대로 풀네임으로 입력하고, 수업 종류가 올바른지 꼭
              확인해주세요. 올바르게 입력하지 않으면 다른 학우들이 찾는데
              어려움을 겪을 수도 있어요.<br></br>
              <a href="https://dean.pku.edu.cn/service/web/courseSearch.php" target="_blank">이곳</a>에서 수업 이름, 분류, 중국유관 여부를 확인해주세요!
            </p>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text id="inputGroup-sizing-lg">강의명</InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
            />
          </InputGroup>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text id="inputGroup-sizing-lg">학점</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows={1}
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={courseCredit}
              onChange={(event) => setCourseCredit(event.target.value)}
            />
          </InputGroup>
          <br></br>
          <Form.Select
            className="mx-auto"
            style={{ width: "80%" }}
            aria-label="Default select example"
            value={courseCategory}
            onChange={(event) => setCourseCat(event.target.value)}
          >
            <option>수업 종류</option>
            <option value="通选课">通选课</option>
            <option value="体育课">体育课</option>
            <option value="专业课">专业课</option>
            <option value="英语课">英语课</option>
            <option value="公选课">公选课</option>
          </Form.Select>
          <br></br>
          <Form.Check
            className="mx-auto"
            type="checkbox"
            label="중국유관 수업인가요?"
            onChange={(event) => setYouGuanStat(youGuanStat === 0 ? 1 : 0)}
            style={{ width: "80%" }}
          ></Form.Check>
          <div className="d-flex justify-content-end mt-4 mr-3">
            <Button variant="success" type="submit">
              제출
            </Button>
          </div>
        </Form>
      </Container>
    </PageView>
  );
}
