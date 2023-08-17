import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";
import "./AboutPage.css";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { relative } from "path";

export default function AboutPage() {
  const navigate = useNavigate();
  const navigateToSupport = () => {
    navigate("/support");
  }
  return (
    <PageView>
      <Container>

        <h1 className="slogan">
          소통의 중심에서,<br></br>
          &emsp;답변 받았습니다.
        </h1>
        <div className="support-us">
          <p>
            원활한 웹사이트 운영을 위해 학우분들의 도움이 필요합니다! <br></br>
            자세한 사항은 Support Us! 페이지를 참고해주세요 :)
          </p>
          <button className="support-button" onClick={navigateToSupport}>
            Support Us
          </button>
        </div>

        <div style={{ display: "flex", position: "relative", top: "-20px" }}>
          <Image
            src="/images/free-icon-send-message-3682321.png"
            alt="message"
            width={30}
            style={{ marginTop: "20px" }}
            fluid
          />
          <hr style={{ border: "none", borderTop: "3px dotted blue", color: "#fff", backgroundColor: "#fff", height: "1px", width: "100%", marginTop: "37px" }}></hr>
        </div>

        <div className="about-box" style={{ position: "relative", top: "-5px" }}>

          <div className="main-about">
            <p className="lead">
              <button className="woori-button" onClick={() => { window.open("https://github.com/WooriVeryGood") }}>
                WooriVeryGood
              </button><br></br>
              <strong>
                "답변 받았습니다!" 는 재학생 개발팀 @우리잘했조가 개발한,
                북경대학교 재학 한국인 유학생들을 위한
                수강정보 공유 커뮤니티입니다.
              </strong>
              <p>
                본 웹사이트는 북경대학교 학우들의 수강평가 공유 및 익명 커뮤니티 웹사이트이며,
                북경대학교 공식 기관과는 아무런 연관이 없음을 알립니다.<br></br>
                본 웹사이트를 사용하시기 전,{" "}
                <a href="/termsconditions">개인정보 수집 약관</a>을 읽어주세요.
                웹사이트 사용 시 본 약관에 동의한 것으로 간주됩니다.
              </p>
            </p>

          </div>

          <div className="st-box">
            <div className="second-about">
              <p>
                학기 초마다 한국 학우들의 수강 경험과 평가를 듣기 위해 수없이 많은
                질문들이 북전교에 올라오지만, 90% 이상의 질문은 저희의 경험상{" "}
                <strong>"답변 받았습니다"</strong>로 끝났습니다.<br></br> 모두가 나누면 좋을
                정보인데, 이럴 필요 없이 모두 공유할수 있는 플랫폼이 생기면 좋겠다
                생각하여 웹사이트 개발에 착수했습니다. <br></br>
                (현재 개발팀장의 위챗에 "답변
                받았습니다"로 검색할 시, 22년 이후 200건이 넘는 기록이 나오고
                있습니다.)
              </p>
            </div>

            <div className="third-about">
              <button className="repo-button" onClick={() => { window.open("https://github.com/WooriVeryGood/honeycourses-frontend") }}>
                Github Repo
              </button>
              <p>
                Github Repo 에서 본 웹사이트의 프론트엔드 소스코드를 확인할
                수 있습니다.<br></br>
                우리잘했조는 북경대학교 컴퓨터공학과 박건호, 장준우, 배호진, 김혜원
                학우로 이루어진 개발 팀입니다.
              </p>
            </div>
          </div>

        </div>

      </Container>
    </PageView>
  );
}
