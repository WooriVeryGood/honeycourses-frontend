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
        <p style={{ marginTop: "30px" }}>
          😣 학기 초마다 한국 학우들의 수강 경험과 평가를 듣기 위해 수없이 많은
          질문들이 북전교에 올라오지만, 90% 이상의 질문은 저희의 경험상{" "}
          <strong>"답변 받았습니다"</strong>로 끝났습니다. 모두가 나누면 좋을
          정보인데, 이럴 필요 없이 모두 공유할수 있는 플랫폼이 생기면 좋겠다
          생각하여 웹사이트 개발에 착수했습니다. (현재 개발팀장의 위챗에 "답변
          받았습니다"로 검색할 시, 22년 이후 200건이 넘는 기록이 나오고
          있습니다.)
        </p>
        <br></br>
        <p>
          ⚠ 본 웹사이트는 북경대학교 학우들의 수강평가를 공유하는 웹사이트이며,
          북경대학교 공식 기관과는 아무런 연관이 없음을 알립니다.
        </p>
        <br></br>
        <p>
          &#127759; 본 웹사이트를 사용하시기 전,{" "}
          <a href="/termsconditions">개인정보 수집 약관</a>을 읽어주세요.
          웹사이트 사용 시 본 약관에 동의한 것으로 간주됩니다.
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
          Github Repo 에서 본 웹사이트의 프론트엔드와 백엔드 소스코드를 확인할
          수 있습니다.
        </p>
        <br></br>
        <p>🙏 원활한 웹사이트 운영을 위해 학우분들의 도움이 필요해요! 자세한 사항은 <a href="/support">Support Us!</a> 페이지를 참고해주세요 :)</p>
        <br></br>
        <p>
          👋 팀 꿀수업은 북경대학교 컴퓨터공학과 17학번 박건호 학우, 18학번
          장준우 학우, 19학번 배호진 학우와 22학번 김혜원 학우로 이루어진 개발
          팀입니다.
        </p>
        <br></br>
        
      </Container>
    </PageView>
  );
}
