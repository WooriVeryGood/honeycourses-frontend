import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";

export default function AboutPage() {
  return (
    <PageView>
      <Container>
        <p className="lead">
          <strong>
            🌟"답변 받았습니다!" 는 재학생 개발팀{" "}
            <a href="https://github.com/orgs/Honeycourse/">@팀 꿀수업</a>이
            개발한, 북경대학교 재학 한국인 유학생들을 위한 수강정보 공유
            커뮤니티입니다.
          </strong>
        </p>
        <hr className="divider"></hr>
        <br></br>
        <p>
          😣 학기 초마다 한국 학우들의 수강 경험과 평가를 듣기 위해 수없이 많은
          질문들이 북전교에 올라오지만, 90% 이상의 질문은 제 경험상{" "}
          <strong>"답변 받았습니다"</strong>로 끝났습니다. 모두가 나누면 좋을
          정보인데, 이럴 필요 없이 모두 공유할수 있는 플랫폼이 생기면 좋겠다
          생각하여 웹사이트 개발에 착수했습니다. (현재 위챗에 "답변
          받았습니다"로 검색할 시, 22년 이후 200건이 넘는 기록이 나오고
          있습니다.)
        </p>
        <br></br>
        <p>
          &#127793; 현재 웹사이트는 개발 진행중이며, 기초 기능 구현은 2달 내로
          완료될 예정입니다. 이 시점에 웹사이트에 있는 모든 수업과 리뷰들은 정식
          배포 후엔 삭제될 예정임을 알립니다.
        </p>
        <br></br>
        <p>
          &#127744; 기초적인 기능들만 구현되어있는 상태이며, 최종 웹사이트
          디자인과 레이아웃도 학우들분께 출시되기 전까진 많이 달라질 예정입니다.
          글 게시시 완벽한 익명성이 보장됩니다.
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
          💻{" "}
          <a href="https://github.com/Honeycourse/honeycourses-frontend">
            honeycourses-frontend
          </a>
          와{" "}
          <a href="https://github.com/Honeycourse/honeycourses-backend-express">
            honeycourses-backend-express
          </a>{" "}
          Github Repo 에서 본 웹사이트의 프론트엔드와 백엔드 코드를 확인할 수
          있습니다.
        </p>
        <br></br>
        <p>
          👋 팀 꿀수업은 북경대학교 컴퓨터공학과 17학번 박건호 학우, 18학번
          장준우 학우, 19학번 배호진 학우와 22학번 김혜원 학우로 이루어진 개발
          팀입니다.
        </p>
      </Container>
    </PageView>
  );
}
