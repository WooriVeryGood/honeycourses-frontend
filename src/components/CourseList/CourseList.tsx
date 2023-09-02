import React, { useState, useEffect, Children } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import PageView from "../PageView/PageView";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import "./CourseList.css";
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import styles from "./CourseList.module.css";
import items from "./sidebar.json" // 전공 목록

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
  const { route } = useAuthenticator((context) => [context.route]);
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showYouguan, setShowYouguan] = useState(false);
  const [layoutRightTitle, setTitle] = useState("All"); //오른쪽 layout 제목 설정
  const [majorBtn, selectBtn] = useState(""); // 专业课버튼만 추리기
  const [open, setOpen] = useState(false); // 전공 사이드바 화살표 방향
  const [selectedMajor, setSelectedMajor] = useState("专业"); // 전공 버튼 선택
  const [majorOpen, setMajorOpen] = useState(false);

  //전공별 분류
  const filterdMajors =
    courses.filter(
      (course: any) =>
        course.kaikeYuanxi === selectedMajor
    );

  const handleSelectMajor = (major: string) => {
    setMajorOpen(true); // 전공별 버튼 누르면 강의목록 카테고리별 분류 숨김
    setSelectedMajor(major);
    setOpen(!open)
  };

  // 전공 선택 기능
  function MyMajor(props: any) {
    if (props.Selectmajor === "전공") {
      if (props.item.childrens) {
        return (
          <div className={open ? styles.open : styles.sidebarItem}>
            <div className={styles.sidebarTitle}>
              <span>
                {selectedMajor}
              </span>
              <i className="bi-chevron-down" onClick={() => setOpen(!open)}></i>
            </div>
            <div className={styles.sidebarContent}>
              {props.item.childrens.map((child: any, index: Number) => <MyMajor key={index} Selectmajor={"전공"} item={child} />)}
            </div>
          </div>
        );
      }
      else {
        return (
          <div>
            <button className={styles.myMajorBtn} onClick={() => handleSelectMajor(props.item.title)}>
              {props.item.title}
            </button>
          </div>
        );
      }
    }
    return null;
  }

  const handleSelectCategory = (category: string) => {
    //rightTitle 입력받기
    setTitle(category);
    //专业课버튼만 추려내기
    if (category === "专业课") {
      selectBtn("전공");
    }
    else {
      selectBtn("");
    }
    setMajorOpen(false); // 강의 목록 버튼 누르면 전공별 분류 숨김
    setSelectedMajor("专业");
    setSelectedCategory(category);
    setShowYouguan(false); // Reset the showYouguan state when selecting a new category
  };

  // New handler for showing courses with isYouguan value of 1
  const handleShowYouguan = () => {
    setTitle("중국유관");
    setSelectedCategory("All"); // Reset the selected category
    setShowYouguan(true);
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const userSession = await Auth.currentSession();
        const jwtToken = userSession.getIdToken().getJwtToken();

        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };

        setIsLoading(true);
        const response = await axios.get(`${apiUrl}/courses`, { headers });
        console.log(response.data);
        setCourses(response.data);
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchDataFromApi();
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

          <div className={styles.CourseListContainer}>
            <div className={styles.CourseListLeft}>
              <div className={styles.listLayout}>
                <div>
                  <h2>
                    강의 목록
                  </h2>
                </div>
                <nav>
                  <ul className={styles.categories}>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${selectedCategory === "All" && !showYouguan
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
                        className={`navLink nav-link btn ${selectedCategory === "通选课" ? "btn-primary" : ""
                          }`}
                        onClick={() => handleSelectCategory("通选课")}
                      >
                        通选课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${selectedCategory === "体育课" ? "btn-primary" : ""
                          }`}
                        onClick={() => handleSelectCategory("体育课")}
                      >
                        体育课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${selectedCategory === "专业课" ? "btn-primary" : ""
                          }`}
                        onClick={() => handleSelectCategory("专业课")}
                      >
                        专业课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${selectedCategory === "公选课" ? "btn-primary" : ""
                          }`}
                        onClick={() => handleSelectCategory("公选课")}
                      >
                        公选课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${selectedCategory === "英语课" ? "btn-primary" : ""
                          }`}
                        onClick={() => handleSelectCategory("英语课")}
                      >
                        英语课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${showYouguan ? "btn-primary" : ""
                          }`}
                        onClick={handleShowYouguan}
                      >
                        중국유관
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>


            <div className={styles.CourseListRight}>
              <div className={styles.rightHeader}>
                <div className={open? styles.openRightTitle: styles.rightTitle}>
                  {layoutRightTitle}
                  <Button
                    href="/courses/addCourse"
                    className="my-auto align-self-center"
                    variant="success"
                    size="sm"
                    style={{ marginLeft: "20px", backgroundColor: "#43A680", borderColor: "#43A680" }}
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
                <div className={styles.sidebar}>
                  {items.map((item, index) => <MyMajor key={index} Selectmajor={majorBtn} item={item} />)}
                </div>
              </div>
              <div className={majorOpen ? styles.myReviews : styles.myMajorReviews}>
                {/* 카테고리별 수업 분류 */}
                <div className={styles.groupReviews}>
                  {filteredCourses.map((course) => (
                    <Link
                      to={`/courses/view/${course.course_id}`}
                      key={course.course_id}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className={styles.courseSet}>
                          <div>
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
                          </div>
                          <div className={styles.courseName}>
                            {course.course_name}{" "}
                          </div>
                        </h5>
                        <span className="text-body-secondary">
                          {course.course_credit}학점
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* 전공별 수업 분류 */}
                <div className={styles.majorGroupReviews}>
                  {filterdMajors.map((course) => (
                    <Link
                      to={`/courses/view/${course.course_id}`}
                      key={course.course_id}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className={styles.courseSet}>
                          <div>
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
                          </div>
                          <div className={styles.courseName}>
                            {course.course_name}{" "}
                          </div>
                        </h5>
                        <span className="text-body-secondary">
                          {course.course_credit}학점
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>


          </div>

        </Container>
      </PageView>
    </div >
  );
}

export default CourseList;
