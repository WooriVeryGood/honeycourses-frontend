import React, { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import "./CourseList.css";
import styles from "./CourseList.module.css";
import items from "./sidebar.json"; // 전공 목록
import { Alert, Collapse, ListGroup } from "react-bootstrap";
import { apiGet } from "../API/APIHandler";

interface Course {
  course_id: string;
  course_name: string;
  course_category: string;
  course_credit: number;
  isYouguan: boolean;
  kaikeYuanxi: string;
  reviewCount: number;
}

function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showYouguan, setShowYouguan] = useState(false);
  const [layoutRightTitle, setTitle] = useState("All"); //오른쪽 layout 제목 설정
  const [majorBtn, selectBtn] = useState(""); // 专业课버튼만 추리기
  const [open, setOpen] = useState(false); // 전공 사이드바 화살표 방향
  const [eventOpen, setEventOpen] = useState(false); // 이벤트 배너 토글
  const [selectedMajor, setSelectedMajor] = useState("专业"); // 전공 버튼 선택
  const [majorOpen, setMajorOpen] = useState(false);
  const [searchCourses, setSearchCourses] = useState<Course[]>([]); //검색 기능
  const [searchInput, setSearchInput] = useState(""); //검색 기능

  //전공별 분류
  const filterdMajors = courses.filter(
    (course: any) => course.kaikeYuanxi === selectedMajor
  );

  const handleSelectMajor = (major: string) => {
    setMajorOpen(true); // 전공별 버튼 누르면 강의목록 카테고리별 분류 숨김
    setSelectedMajor(major);
    setOpen(!open);
  };

  // 검색 기능
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    const filtered = courses.filter((course) =>
      course.course_name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSearchCourses(filtered);
  };

  // 전공 선택 기능
  function MyMajor(props: any) {
    if (props.Selectmajor === "전공") {
      if (props.item.childrens) {
        return (
          <div className={open ? styles.open : styles.sidebarItem}>
            <div className={styles.sidebarTitle}>
              <span>{selectedMajor}</span>
              <i className="bi-chevron-down" onClick={() => setOpen(!open)}></i>
            </div>
            <div className={styles.sidebarContent}>
              {props.item.childrens.map((child: any, index: Number) => (
                <MyMajor key={index} Selectmajor={"전공"} item={child} />
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <button
              className={styles.myMajorBtn}
              onClick={() => handleSelectMajor(props.item.title)}
            >
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
    } else {
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
        setIsLoading(true);
        const response = await apiGet(`/courses`);
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
                  <h2>강의 목록</h2>
                </div>
                <nav>
                  <ul className={styles.categories}>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
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
                        className={`navLink nav-link btn ${
                          selectedCategory === "通选课" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("通选课")}
                      >
                        通选课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "体育课" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("体育课")}
                      >
                        体育课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "专业课" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("专业课")}
                      >
                        专业课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "公选课" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("公选课")}
                      >
                        公选课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          selectedCategory === "英语课" ? "btn-primary" : ""
                        }`}
                        onClick={() => handleSelectCategory("英语课")}
                      >
                        英语课
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`navLink nav-link btn ${
                          showYouguan ? "btn-primary" : ""
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
              <Alert key="update" variant="info">
                <Alert.Link href="#" onClick={() => setEventOpen(!eventOpen)}>
                  🔥23-24학년도 1학기 강의평가 작성 이벤트가 진행되고
                  있습니다!🔥 (눌러서 자세히 보기)
                </Alert.Link>
                <Collapse in={eventOpen}>
                  <div id="update-log">
                    <br></br>
                    🌟 즐거운 종강이 찾아왔습니다! 그와 동시에 15일 월요일부터
                    다음학기 쉔커도 시작된다는 사실, 알고 계셨나요? 이번 학기가
                    시작했던때 진행했던것처럼, 우리잘했조는 이번에도{" "}
                    <strong>🔥강의평가 작성 이벤트🔥</strong>를 진행해보려
                    합니다!!
                    <br></br>
                    <br></br>
                    🔥 본 이벤트의 규칙은 간단합니다! 현 시각부터{" "}
                    <strong>1월 27일</strong>까지, 2주의 기간동안, 웹사이트에
                    ✍가장 많은 강의평가를 작성해주신 세분✍께 러킨 음료
                    상품권을 드릴 예정입니다!{" "}
                    <strong>
                      (1위 100위안, 2위 60위안, 3위 40위안, 공동 1위/2위 발생시
                      금액 조정)
                    </strong>
                    <br></br>
                    <br></br>✨ 이번엔 지난번처럼 원줸을 통해 응모할 필요 없이,
                    리뷰 작성시 작성자의 아이디 (이메일)을 저장하여 통계를
                    진행할 예정입니다. 제한 사항으로{" "}
                    <strong>
                      인당 리뷰 5개 이상 작성, 수업 리뷰와 관련 없는 글 작성
                      금지
                    </strong>
                    만 지켜주시면 됩니다!
                    <br></br>
                    <br></br>
                    🎖 금번 경품은 우리잘했조에 후원해주신 여러분 덕분에
                    마련되었습니다, 후원해주신 분들 모두 감사합니다! 이번 쉔커
                    기간만큼은, "답변 받았습니다!"로 채워지는 북전교 대신, 이번
                    학기 들은 수업 정보도 나누며, 이벤트를 통해 모두가 도움
                    받을수 있도록 시스템이 더욱 더 정착될 수 있었으면
                    좋겠습니다:))
                    <br></br>
                    <br></br>
                    많은 참여 부탁드립니다:)
                  </div>
                </Collapse>
              </Alert>
              <div>
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="수업 검색해보기"
                  aria-label="Search"
                  style={{ width: "100%", height: "50px" }}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />

                {searchInput && (
                  <div className="d-flex justify-content-center">
                    <div style={{ width: "90%" }}>
                      <ListGroup>
                        {searchCourses.map((course) => (
                          <Link
                            to={`/courses/view/${course.course_id}`}
                            key={course.course_id}
                            className="list-group-item"
                            target="_blank"
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
                  </div>
                )}
              </div>
              <br></br>
              <div className={styles.rightHeader}>
                <div
                  className={open ? styles.openRightTitle : styles.rightTitle}
                >
                  {layoutRightTitle}
                  <Button
                    href="/courses/addCourse"
                    className="my-auto align-self-center"
                    variant="success"
                    size="sm"
                    style={{
                      marginLeft: "20px",
                      backgroundColor: "#43A680",
                      borderColor: "#43A680",
                    }}
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
                  {items.map((item, index) => (
                    <MyMajor key={index} Selectmajor={majorBtn} item={item} />
                  ))}
                </div>
              </div>
              <div
                className={majorOpen ? styles.myReviews : styles.myMajorReviews}
              >
                {/* 카테고리별 수업 분류 */}
                <div className={styles.groupReviews}>
                  {filteredCourses.map((course) => (
                    <Link
                      to={`/courses/view/${course.course_id}`}
                      key={course.course_id}
                      className="list-group-item list-group-item-action"
                      target="_blank"
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
                            ) : null}{" "}
                            <Badge
                              bg="#65C18C"
                              style={{ backgroundColor: "#279EFF" }}
                            >
                              리뷰 {course.reviewCount}개
                            </Badge>{" "}
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
    </div>
  );
}

export default CourseList;
