import PageView from "../PageView/PageView";
import axios from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
import { Collapse } from "react-bootstrap";
import Typewriter from "typewriter-effect";
import { CSSTransition } from "react-transition-group";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

interface Course {
  course_id: string;
  course_name: string;
  course_category: string;
  course_credit: number;
  isYouguan: boolean;
  kaikeYuanxi: string;
}

export default function HomePage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [open, setOpen] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userSession = await Auth.currentSession();
        const jwtToken = userSession.getAccessToken().getJwtToken();
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const response = await axios.get<Course[]>(`${apiUrl}/courses`, {
          headers,
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponents(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    const filtered = courses.filter((course) =>
      course.course_name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <PageView>
      <Container
        fluid
        className="justify-content-center align-items-center text-center"
        style={{ paddingTop: "40px" }}
      >
        <div>
          <Row>
            <Col style={{ position: "relative" }}>
              <Image
                src="/images/shoububble.png"
                alt="왜 너만 답받냐고"
                width={476}
                style={{
                  marginTop: "20px",
                  marginRight: "40px",
                  marginBottom: "15px",
                }}
                fluid
              />
              <div
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  paddingLeft: window.innerWidth < 550 ? "5%" : 0,
                }}
              >
                <h1 className="display-6" style={{ whiteSpace: "nowrap" }}>
                  {" "}
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter.typeString("답변 받았습니다!").start();
                    }}
                    options={{
                      autoStart: true,
                      delay: 150,
                    }}
                  />
                </h1>
              </div>
            </Col>
          </Row>

          <CSSTransition
            in={showComponents}
            timeout={3000}
            classNames="fade"
            unmountOnExit
          >
            <div>
              <h1 className="display-5">
                <strong>답변, 받으셨나요?</strong>
              </h1>
              <p className="lead">
                받은 답변, 알고있는 답변. 꿀수업 정보 이제 혼자 알지 말고 모두와
                같이 나눠봐요.
              </p>
              <div className="d-flex justify-content-center">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="수업 검색해보기"
                  aria-label="Search"
                  style={{ width: "90%" }}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
              </div>
              {searchInput && (
                <div className="d-flex justify-content-center">
                  <div style={{ width: "90%" }}>
                    <ListGroup>
                      {filteredCourses.map((course) => (
                        <Link
                          to={`/courses/view/${course.course_id}`}
                          key={course.course_id}
                          className="list-group-item"
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
              <figure className="text-center">
                <br></br>

                <p>
                  <em>
                    답변 받았습니다! 는 북경대학교 한국인 유학생들을 위한 강의
                    정보공유 웹사이트입니다.
                  </em>
                  <br></br>
                  웹사이트 사용 전, 꼭 <a href="/about">About 페이지</a>의
                  안내를 읽어주세요.<br></br>
                </p>

                <Alert key="update" variant="success">
                    커뮤니티 베타 서비스가 종료되었습니다. 추후 서비스 정식 출시 시 북전교에 공지될 예정입니다. 베타 서비스에 참여해주신 여러분들께 감사드립니다:)
                </Alert>

                <Alert key="update" variant="info">
                  <Alert.Link href="#" onClick={() => setOpen(!open)}>
                    &gt; 업데이트 내역 확인 (최신 업데이트: 2024.01.20)
                  </Alert.Link>
                  <Collapse in={open}>
                    <div id="update-log">
                      <div>
                        <strong>Release@2023.06.25:</strong> <br></br>
                        1. 1.0.0 버전 정식 릴리즈.
                      </div>
                      <br />
                      <div>
                        <strong>Release@2023.07.28:</strong> <br></br>
                        1. 1.1.0b 버전 정식 릴리즈. <br />
                        2. 로그인 기능 추가. <br />
                        3. AWS Amplify로 서버 서비스 이전.
                      </div>
                      <br />
                      <div>
                        <strong>Release@2023.08.13:</strong> <br></br>
                        1. 커뮤니티 베타 기능 추가.
                      </div>
                      <br />
                      <div>
                        <strong>Release@2023.08.30:</strong> <br></br>
                        1. 커뮤니티 카테고리별 분류 기능 추가.
                      </div>
                      <br />
                      <div>
                        <strong>Release@2023.09.07:</strong> <br></br>
                        1. UI 전면적 리디자인.<br />
                        2. 커뮤니티 베타 서비스 종료.<br />
                        3. 강의평가 작성 이벤트 공지 추가.
                      </div>
                      <br />
                      <div>
                        <strong>Release@2024.01.20:</strong> <br></br>
                        1. 강의평가 조회 UI 개선.<br />
                        2. 제출버튼 반복 클릭시 신규 수업/강의평가가 반복적으로 올라가는 문제 해결.<br />
                      </div>
                    </div>
                  </Collapse>
                </Alert>
                <p>Made with 💙 by @우리잘했조.</p>
              </figure>
            </div>
          </CSSTransition>
        </div>
      </Container>
    </PageView>
  );
}
