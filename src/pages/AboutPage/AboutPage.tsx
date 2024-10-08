import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";
import styles from "./AboutPage.module.css";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { useEffect } from "react";
import AboutSection from "./components/AboutSection/AboutSection";

export default function AboutPage() {
  const navigate = useNavigate();
  const navigateToSupport = () => {
    navigate("/support");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageView>
      <Container>
        <div className={styles.aboutContainer}>
          <div className={styles.title}>
            <h1>ABOUT US</h1>
            <div>"소통의 중심에서,</div>
            <div style={{ fontWeight: "600" }}>답변 받았습니다."</div>
          </div>
          <div className={styles.veryGood}></div>
          <AboutSection
            aboutText='"답변 받았습니다!" 는 재학생 개발팀 @우리잘했조가 개발한, 
북경대학교 재학 한국인 유학생들을 위한 수강정보 공유 커뮤니티입니다.'
            btnName="WooriVeryGood"
            btnUrl="https://github.com/WooriVeryGood"
          />
          <div className={styles.aboutContent}>
            학기 초마다 한국 학우들의 수강 경험과 평가를 듣기 위해 수없이 많은
            질문들이 북전교에 올라오지만, 90% 이상의 질문은 저희의 경험상 "답변
            받았습니다"로 끝났습니다. 모두가 나누면 좋을 정보인데, 이럴 필요
            없이 모두 공유할수 있는 플랫폼이 생기면 좋겠다 생각하여 웹사이트
            개발에 착수했습니다.
          </div>
          <AboutSection
            aboutText="원활한 웹사이트 운영을 위해 학우분들의 도움이 필요합니다!자세한 사항은 Support Us! 페이지를 참고해주세요 :)"
            btnName="Support Us!"
            btnUrl=""
          />

          <div className={styles.title}>
            <h1>OUR TEAM</h1>
          </div>

          <AboutSection
            aboutText="Github Repo 에서 본 웹사이트의 프론트엔드 소스코드를 확인할 수 있습니다."
            btnName="Github Repo"
            btnUrl="https://github.com/WooriVeryGood/honeycourses-frontend"
          />

          <p>
            본 웹사이트는 북경대학교 한국인 학우들을 위한 수강평가 공유 및 익명
            커뮤니티 웹사이트이며, 웹사이트와 개발진인 우리잘했조는 북경대학교,
            북경대학교 한국유학생회 등 공식 기관과는 연관이 없음을 알립니다. 본
            웹사이트를 사용하시기 전,{" "}
            <a href="/termsconditions">개인정보 수집 약관</a>을 읽어주세요.
            웹사이트 사용 시 본 약관에 동의한 것으로 간주됩니다.
          </p>
        </div>
      </Container>
    </PageView>
  );
}
