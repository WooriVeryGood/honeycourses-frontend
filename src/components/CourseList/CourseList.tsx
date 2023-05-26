import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import PageView from "../PageView/PageView";
import ListGroup from "react-bootstrap/ListGroup";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Badge from 'react-bootstrap/Badge';
import axios from "axios";

interface Course {
  course_id: string;
  course_name: string;
  course_category: string;
  course_credit: number;
}

const apiUrl = process.env.REACT_APP_API_URL;

function CourseList() {
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(`${apiUrl}/courses`)
      .then((response) => {
        console.log(response.data);
        setCourses(response.data);
        setIsLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false);
        window.scrollTo(0, 0);
      });
  }, []);
  

  // Filter courses based on selected category
  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.course_category === selectedCategory);

  return (
    <div>
      <PageView isLoading={isLoading}> 
        <Container
          fluid
          className="d-flex justify-content-center align-items-start"
        >
          <div style={{ width: "90%" }}>
            <Row>
              <Col xs lg="2"><h2>강의 목록</h2></Col>
              <Col xs>
              <Button
                href="/courses/addCourse"
                variant="success"
                size="sm"
                
              >
                <img
                  src="/images/plus.svg"
                  className="bi"
                  width="23"
                  height="23"
                  alt="github-icon"
                />
                수업 추가
              </Button>
              </Col>
            </Row>
            {/* Nav selector */}
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "All" ? "btn-dark" : ""
                    }`}
                    onClick={() => setSelectedCategory("All")}
                  >
                    All
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "通选课" ? "btn-dark" : ""
                    }`}
                    onClick={() => setSelectedCategory("通选课")}
                  >
                    通选课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "体育课" ? "btn-dark" : ""
                    }`}
                    onClick={() => setSelectedCategory("体育课")}
                  >
                    体育课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "专业课" ? "btn-dark" : ""
                    }`}
                    onClick={() => setSelectedCategory("专业课")}
                  >
                    专业课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "公选课" ? "btn-dark" : ""
                    }`}
                    onClick={() => setSelectedCategory("公选课")}
                  >
                    公选课
                  </button>
                </li>
              </ul>
            </nav>
            <ListGroup>
              {filteredCourses.map((course) => (
                <Link
                  to={`/courses/view/${course.course_id}`}
                  key={course.course_id}
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>{course.course_name}{' '}<Badge bg="primary">{course.course_category}</Badge></h5>
                    <span className="text-body-secondary">
                      {course.course_credit}학점
                    </span>
                  </div>
                </Link>
              ))}
            </ListGroup>
          </div>
        </Container>
      </PageView>
    </div>
  );
}

export default CourseList;
