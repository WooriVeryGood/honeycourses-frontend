import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import PageView from "../PageView/PageView";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import "./CourseList.css";

interface Course {
  course_id: string;
  course_name: string;
  course_category: string;
  course_credit: number;
  isYouguan: boolean;
  kaikeYuanxi: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showYouguan, setShowYouguan] = useState(false);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setShowYouguan(false); // Reset the showYouguan state when selecting a new category
  };

  // New handler for showing courses with isYouguan value of 1
  const handleShowYouguan = () => {
    setSelectedCategory("All"); // Reset the selected category
    setShowYouguan(true);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/courses`)
      .then((response) => {
        console.log(response.data);
        setCourses(response.data);
        setIsLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        window.scrollTo(0, 0);
      });
  }, []);

  // 카테고리별 수업 분류
  const filteredCourses =
    selectedCategory === "All"
      ? showYouguan
        ? courses.filter((course) => course.isYouguan)
        : courses
      : courses.filter(
          (course) =>
            course.course_category === selectedCategory &&
            (!showYouguan || course.isYouguan)
        );

  return (
    <div>
      <PageView isLoading={isLoading}>
        <Container
          fluid
          className="d-flex justify-content-center align-items-start"
        >
          <div style={{ width: "90%" }}>
            <div
              className="d-flex align-items-left"
              style={{ marginBottom: "10px" }}
            >
              <h2>강의 목록</h2>
              <Button
                href="/courses/addCourse"
                className="my-auto align-self-center"
                variant="success"
                size="sm"
                style={{ marginLeft: "20px", backgroundColor:"#43A680",  borderColor:"#43A680" }}
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
            </div>
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "All" && !showYouguan
                        ? "btn-primary"
                        : ""
                    }`}
                    onClick={() => handleSelectCategory("All")}
                  >
                    All
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "通选课" ? "btn-primary" : ""
                    }`}
                    onClick={() => handleSelectCategory("通选课")}
                  >
                    通选课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "体育课" ? "btn-primary" : ""
                    }`}
                    onClick={() => handleSelectCategory("体育课")}
                  >
                    体育课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "专业课" ? "btn-primary" : ""
                    }`}
                    onClick={() => handleSelectCategory("专业课")}
                  >
                    专业课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "公选课" ? "btn-primary" : ""
                    }`}
                    onClick={() => handleSelectCategory("公选课")}
                  >
                    公选课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      selectedCategory === "英语课" ? "btn-primary" : ""
                    }`}
                    onClick={() => handleSelectCategory("英语课")}
                  >
                    英语课
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${
                      showYouguan ? "btn-primary" : ""
                    }`}
                    onClick={handleShowYouguan}
                  >
                    중국유관
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
                    <h5>
                      {course.course_name}{" "}
                      <Badge
                        bg="#236969"
                        style={{ backgroundColor: "#236969" }}
                      >
                        {course.course_category}
                      </Badge>{" "}
                      <Badge
                        bg="#65C18C"
                        style={{ backgroundColor: "#65C18C" }}
                      >
                        {course.kaikeYuanxi}
                      </Badge>{" "}
                      {course.isYouguan ? (
                        <Badge
                          className="rounded-pill"
                          bg="#FF7BA9"
                          style={{ backgroundColor: "#489CC1" }}
                        >
                          중국유관
                        </Badge>
                      ) : null}
                    </h5>
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
