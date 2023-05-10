import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import PageView from "../PageView/PageView";
import ListGroup from "react-bootstrap/ListGroup";

const dummyCourses = [
  {
    id: 1,
    name: "计算机系统导论",
    category: "专业课",
    credit: 5,
  },
  {
    id: 2,
    name: "中国古代文学（下）",
    category: "通选课",
    credit: 3,
  },
  {
    id: 3,
    name: "English 101",
    category: "通选课",
    credit: 3,
  },
  {
    id: 4,
    name: "Basketball",
    category: "体育课",
    credit: 1,
  },
  {
    id: 5,
    name: "Chemistry 201",
    category: "专业课",
    credit: 4,
  },
];

function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter courses based on selected category
  const filteredCourses =
    selectedCategory === "All"
      ? dummyCourses
      : dummyCourses.filter((course) => course.category === selectedCategory);

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
                  to={`/courses/view/${course.id}`}
                  key={course.id}
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>{course.name}</h5>
                    <span>Credit: {course.credit}</span>
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
