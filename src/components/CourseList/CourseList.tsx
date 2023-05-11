import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import PageView from "../PageView/PageView";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";

interface Course {
  course_id: string;
  course_name: string;
  course_category: string;
  course_credit: number;
  // other properties
}

function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/courses")
      .then(response => {
        console.log(response.data);
        setCourses(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  // Filter courses based on selected category
  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.course_category === selectedCategory);

  return (
    <div>
      <PageView>
        <Container
          fluid
          className="d-flex justify-content-center align-items-start"
        >
          <div style={{ width: "80%" }}>
            <h2>All Courses</h2>
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
                    <h5>{course.course_name}</h5>
                    <span>{course.course_credit}학점</span>
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
