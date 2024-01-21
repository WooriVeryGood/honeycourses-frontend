import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Auth } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import styles from "./EditReview.module.css";

const apiUrl = process.env.REACT_APP_API_URL;

export default function EditReview() {
  const pathSegments = window.location.pathname.split("/");
  const courseId = pathSegments[2];
  const review_id = pathSegments[4];
  const { user } = useAuthenticator((context) => [context.user]);
  const [course_name, setCourseName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setSubmit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { reviewTitle, reviewContent } = location.state || {
    reviewTitle: "",
    reviewContent: "",
  };
  const [review_title, setReviewTitle] = useState(reviewTitle);
  const [review_content, setReviewContent] = useState(reviewContent);

  const getCognitoToken = async () => {
    try {
      const userSession = await Auth.currentSession();
      return userSession.getAccessToken().getJwtToken();
    } catch (error) {
      console.error("Error getting Cognito token:", error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitted) {
      setSubmit(true);
      const jwtToken = await getCognitoToken();

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const data = {
        review_title,
        review_content,
      };
      axios
        .put(`${apiUrl}/courses/reviews/${review_id}`, data, { headers })
        .then((response) => {
          console.log(response.data);
          alert("리뷰 수정에 성공했습니다!");
          navigate(`/courses/view/${courseId}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const jwtToken = await getCognitoToken();

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        const nameResponse = await axios.get(
          `${apiUrl}/courses/${courseId}/name`,
          { headers }
        );
        setCourseName(nameResponse.data.course_name);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          navigate("/courses");
          alert("존재하지 않는 수업입니다.");
        } else {
          console.error("Error:", axiosError);
        }
      }
    };

    fetchData();
    setIsLoading(false);
  }, [courseId, navigate]);

  return (
    <PageView isLoading={isLoading}>
      <Container fluid className={styles.editReviewBox}>
        <div>
          <div>
            <h2 className={styles.editReviewTitle}>
              수강 평가 수정: {course_name}
            </h2>
          </div>
        </div>
        <div>
          <div>
            <p className={styles.editReviewCaution}>
              강의평가 제목, 내용에 대한 수정이 가능합니다.
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
          <InputGroup
            className="mb-3 mx-auto"
            style={{ flexWrap: "nowrap" }}
          ></InputGroup>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
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
