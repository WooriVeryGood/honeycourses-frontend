import { useState, useEffect, ChangeEvent } from "react";
import Container from "react-bootstrap/Container";
import PageView from "../PageView/PageView";
import Button from "react-bootstrap/Button";
import styles from "./CourseList.module.css";
import items from "./sidebar.json"; // 전공 목록
import { Alert } from "react-bootstrap";
import { apiGet } from "../API/APIHandler";
import CourseSidebar from "./components/CourseSidebar/CourseSidebar";
import { Course } from "../../types/course";
import CourseSearchbar from "./components/CourseSearchbar/CourseSearchbar";
import CourseCard from "./components/CourseCard/CourseCard";

export default function CourseList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showYouguan, setShowYouguan] = useState(false);
  const [layoutRightTitle, setTitle] = useState("All"); //오른쪽 layout 제목 설정
  const [majorBtn, selectBtn] = useState(""); // 专业课버튼만 추리기
  const [open, setOpen] = useState(false); // 전공 사이드바 화살표 방향
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

  const handleShowYouguan = () => {
    setTitle("중국유관");
    setSelectedCategory("All");
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
            <CourseSidebar
              selectedCategory={selectedCategory}
              showYouguan={showYouguan}
              handleSelectCategory={handleSelectCategory}
              handleShowYouguan={handleShowYouguan}
            />
            <div className={styles.CourseListRight}>
              <Alert key="legacyReviewAlert" variant="info">
                2024년 2월 1일 이전에 작성된 리뷰는 수정/삭제가 불가능합니다.
              </Alert>
              <CourseSearchbar
                searchCourses={searchCourses}
                searchInput={searchInput}
                handleSearchInputChange={handleSearchInputChange}
              />
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
                    <CourseCard course={course} />
                  ))}
                </div>

                {/* 전공별 수업 분류 */}
                <div className={styles.majorGroupReviews}>
                  {filterdMajors.map((course) => (
                    <CourseCard course={course} />
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
