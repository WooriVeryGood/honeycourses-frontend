import { useState, useEffect } from "react";
import axios from "axios";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";

interface Review {
  review_title: string;
  review_id: number;
  review_content: string;
}

export default function CourseReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const courseId = window.location.pathname.split("/").pop();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/courses/${courseId}/reviews`)
      .then((response) => {
        setReviews(response.data)
        console.log(response.data)
      })
      .catch((error) => console.error(error));
  }, [courseId]);

  return (
    <PageView>
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <h2 style={{ textAlign: "center" }}>Reviews</h2>
        {reviews.map((review) => (
          <Card style={{ width: "90%", marginBottom: "30px" }} key={review.review_id}>
            <Card.Body className="text-start">
              <Card.Title>{review.review_title}</Card.Title>
              <hr className="divider"></hr>
              <Card.Text>
                {review.review_content}
                <br />
                <br />
              </Card.Text>
              <hr className="divider"></hr>
              <ButtonGroup aria-label="Basic example" className="float-end">
                <Button variant="success">추천</Button>
                <Button variant="danger">비추천</Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </PageView>
  );
}
