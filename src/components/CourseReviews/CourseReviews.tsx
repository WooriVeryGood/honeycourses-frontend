import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function CourseReviews() {
  return (
    <PageView>
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <h2 style={{ textAlign: "center" }}>Reviews</h2>
        <Card style={{ width: "90%" }}>
          <Card.Body className="text-start">
            <Card.Title>점수가 짜요</Card.Title>
            <hr className="divider"></hr>
            <Card.Text>
              수업 내용은 좋고 선생님도 착한데, 점수를 잘 안 주는거 같아요.
              <br />
              출석 5번 불렸을동안 안온거 뺀게 좀 감점 요인이 되지 않았나 싶네요.
              <br />
              <br />
              비추해요.
              <br />
              <br />
              점수:59.5점
            </Card.Text>
            <hr className="divider"></hr>
            <ButtonGroup aria-label="Basic example" className="float-end">
              <Button variant="success">추천</Button>
              <Button variant="danger">비추천</Button>
            </ButtonGroup>
          </Card.Body>
        </Card>
        <br></br>
        <Card style={{ width: "90%" }}>
          <Card.Body className="text-start">
            <Card.Title>Easy</Card.Title>
            <hr className="divider"></hr>
            <Card.Text>
              ㄹㅇ 개쉬움 ㅋㅋㅋ
              <br />
              <br />
              점수:95점
            </Card.Text>
            <hr className="divider"></hr>
            <ButtonGroup aria-label="Basic example" className="float-end">
              <Button variant="success">추천</Button>
              <Button variant="danger">비추천</Button>
            </ButtonGroup>
          </Card.Body>
        </Card>
      </Container>
    </PageView>
  );
}
