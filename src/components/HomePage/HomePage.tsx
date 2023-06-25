import PageView from "../PageView/PageView";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
import { Collapse } from "react-bootstrap";
import Typewriter from "typewriter-effect";
import { CSSTransition } from "react-transition-group";
import "./HomePage.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponents(true);
    }, 3000); // Adjust the delay time according to your preference

    return () => clearTimeout(timer);
  }, []);

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
                  paddingLeft: window.innerWidth < 550 ? "5%" : 0, // Add padding for mobile size
                }}
              >
                <h1 className="display-6" style={{ whiteSpace: "nowrap" }}>
                  {" "}
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter.typeString("답변 받았습니다!").start(); // Trigger animation completion
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
                  placeholder="수업 검색해보기 (아직 검색기능은 구현 안되어있음)"
                  aria-label="Search"
                  style={{ width: "70vh" }}
                />
                <button
                  className="btn btn-success my-2 my-sm-0 ml-auto"
                  style={{ backgroundColor: "#128494" }}
                  type="submit"
                >
                  Search
                </button>
              </div>
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

                <Alert key="update" variant="info">
                  <Alert.Link href="#" onClick={() => setOpen(!open)}>
                    &gt; 업데이트 내역 확인 (최신 업데이트: 2023.6.xx)
                  </Alert.Link>
                  <Collapse in={open}>
                    <div id="update-log">
                      <div>
                        <strong>Release@2023.06.xx:</strong> <br></br>
                        1. 웹사이트 1.0.0 버전 정식 릴리즈.
                      </div>
                    </div>
                  </Collapse>
                </Alert>
                <p>
                  Made with 💙 by{" "}
                  <a
                    href="https://github.com/WooriVeryGood"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @우리잘했조
                  </a>
                  .
                </p>
              </figure>
            </div>
          </CSSTransition>
        </div>
      </Container>
    </PageView>
  );
}
