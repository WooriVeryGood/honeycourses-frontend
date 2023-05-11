import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";

export default function AboutPage() {
  return (
    <PageView>
      <Container>      
        <p className="lead">
          <strong>
            🌟"답변 받았습니다!" 는 재학생인{" "}
            <a href="https://github.com/timingsniper">@railgunOfPku</a>가
            개발한, 북경대학교 재학 한국인 유학생들을 위한 수강정보 공유
            커뮤니티입니다.
          </strong>
        </p>
        <hr className="divider"></hr>
        <br></br>
        <p>
          &#127793; 현재 웹사이트는 개발 진행중이며, 기초 기능 구현은 2달 내로
          완료될 예정입니다. 이 시점에 웹사이트에 있는 모든 수업과 리뷰들은
          개발자가 테스트용으로 임의로 DB에 추가한 데이터임을 알립니다.
        </p>
        <br></br>
        <p>
          &#127744; 아직 많은 기능들이 미완성 상태이며, 현재 글/수업 추가 기능
          등이 구현되어 있지 않고, 최종 웹사이트 디자인과 레이아웃도 학우들분께
          출시되기 전까진 많이 달라질 예정입니다. 게다가 아직 도메인도 없습니다!
        </p>
        <br></br>
        <p>
          &#127759; 본 웹 앱은 React, Bootstrap을 사용한 프론트엔드와 MySQL
          데이터베이스, Express를 사용한 api 백엔드로 개발되어, 현재 AWS 일본
          도쿄 리젼의 EC2 인스턴스에 배포되어 있습니다.
        </p>
        <br></br>
        <p>
          ⚠ 본 웹사이트는 북경대학교 학우들의 수강평가를 공유하는 웹사이트이며,
          북경대학교 공식 기관과는 아무런 연관이 없음을 알립니다.
        </p>
        <br></br>
        <p>
        💻 <a href="https://github.com/timingsniper/project-railgun-frontend">project-railgun-frontend</a>와 <a href="https://github.com/timingsniper/project-railgun-backend">project-railgun-backend</a>{' '}Github Repo 에서 본 웹사이트의 프론트엔드와 백엔드 코드를 확인할 수 있습니다.
        </p>
      </Container>
    </PageView>
  );
}
