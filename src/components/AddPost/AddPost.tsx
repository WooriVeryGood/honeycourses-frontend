import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Auth } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AddPost() {
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.route,
  ]);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [category, setCategory] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [isSubmitted, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSubmitted) {
      setSubmit(true);
      const userSession = await Auth.currentSession();
      const jwtToken = userSession.getIdToken().getJwtToken();

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const data = {
        email: user?.attributes?.email,
        post_title: postTitle,
        post_content: postContent,
        post_category: category,
      };

      axios
        .post(`${apiUrl}/community`, data, { headers })
        .then((response) => {
          if (response.data.success) {
            alert("게시글 등록에 성공했습니다!");
            navigate(`/community`);
          } else {
            alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <PageView>
      <Container fluid className="justify-content-center align-items-center">
        <Row>
          <Col xs={8}>
            <h2 style={{ marginLeft: "14%" }}>게시글 추가</h2>
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
              placeholder="제목을 입력해주세요 (45자 이내)"
              aria-describedby="inputGroup-sizing-sm"
              value={postTitle}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPostTitle(event.target.value)
              }
              maxLength={45}
              required
            />
          </InputGroup>

          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text>내용</InputGroup.Text>
            <Form.Control
              as="textarea"
              placeholder="내용을 입력해주세요 (2000자 이내)"
              rows={4}
              value={postContent}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPostContent(event.target.value);
                setContentLength(event.target.value.length);
              }}
              maxLength={2000}
              required
            />
          </InputGroup>
          <div
            className="text-end mr-4"
            style={{ width: "80%", margin: "0 auto" }}
          >
            {contentLength}/2000
          </div>

          <Form.Select
            className="mx-auto"
            style={{ width: "80%" }}
            aria-label="카테고리 선택"
            value={category}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setCategory(event.target.value)
            }
            required
          >
            <option value="">카테고리 선택</option>
            <option value="자유">자유</option>
            <option value="질문">질문</option>
            <option value="중고거래">중고거래</option>
            <option value="구인">구인</option>
          </Form.Select>

          <div className="d-flex justify-content-end mt-4 mr-3">
            <Button variant="success" type="submit">
              게시
            </Button>
          </div>
        </Form>
      </Container>
    </PageView>
  );
}
