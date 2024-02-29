import PageView from "../PageView/PageView";
import { Container, Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Typewriter from "typewriter-effect";
import styles from "./HomePage.module.css";
import HomeAlert from "./components/HomeAlert";

export default function HomePage() {
  return (
    <PageView>
      <Container
        fluid
        className="justify-content-center align-items-center text-center"
        style={{ paddingTop: "40px" }}
      >
        <div className={styles.homePageBody}>
          <Row>
            <Col style={{ position: "relative" }}>
              <Image
                className={styles.bubbleImg}
                src="/images/shoububble.png"
                alt="왜 너만 답받냐고"
                width={476}
                style={{
                  marginTop: "20px",
                  marginRight: "40px",
                  marginBottom: "15px",
                }}
              />

              <div
                className={styles.bubbleText}
                style={{
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

          <div>
            <h1 className="display-5">
              <strong>답변, 받으셨나요?</strong>
            </h1>
            <p className="lead">
              받은 답변, 알고있는 답변. 꿀수업 정보 이제 혼자 알지 말고 모두와
              같이 나눠봐요.
            </p>

            <figure className="text-center">
              <p>
                <em>
                  답변 받았습니다! 는 북경대학교 한국인 유학생들을 위한 강의
                  정보공유 웹사이트입니다.
                </em>
                <br></br>
                웹사이트 사용 전, 꼭 <a href="/about">About 페이지</a>의 안내를
                읽어주세요.<br></br>
              </p>

              <HomeAlert />
              <p>Made with 💙 by @우리잘했조.</p>
            </figure>
          </div>
        </div>
      </Container>
    </PageView>
  );
}
