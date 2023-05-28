import PageView from "../PageView/PageView";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
import { Collapse } from "react-bootstrap";

// @todo 애니메이션 효과
export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <PageView>
      <Container
        fluid
        className="justify-content-center align-items-center text-center"
        style={{ paddingTop: "90px" }}
      >
        <div>
          <Image
            src="/images/wtf.png"
            alt="Responsive image"
            width={"288px"}
            height={"102px"}
            fluid
          />
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
            </p>

            <Alert key="info" variant="info">
              현재 개발 진행중인 웹사이트이며, 수시로 업데이트되며 테스트 단계에
              있습니다. 정식 배포 후엔 현재 게시된 평가들이 모두 삭제될
              예정입니다.<br></br>
              <Alert.Link href="/about">About</Alert.Link> 페이지를
              참고해주세요.
            </Alert>
            <Alert key="update" variant="success">
              <Alert.Link href="#" onClick={() => setOpen(!open)}>
                &gt; 업데이트 내역 확인 (최신 업데이트: 2023.5.27)
              </Alert.Link>
              <Collapse in={open}>
                <div id="update-log">
                  <div>
                    <strong>Hotfix@2023.05.18:</strong> <br></br>
                    1. 데이터 로딩 시 로딩 효과, 화면 스크롤 자동 올리기 기능
                    추가
                    <br></br>
                    2. 모바일 화면 버그 수정<br></br>
                    3. 강의평가 페이지에 해당 수업 이름 보이게 추가
                  </div>
                  <br></br>
                  <div>
                    <strong>Hotfix@2023.05.19:</strong> <br></br>
                    1. 추천/비추 버튼 1회 클릭 시 비활성화 기능 추가
                    <br></br>
                  </div>
                  <br></br>
                  <div>
                    <strong>Hotfix@2023.05.26: </strong>
                    <br></br>
                    1. 추천/비추 버튼 1회 클릭 시 비활성화 기능 localstorage
                    활용<br></br>
                    2. 리뷰가 없는 수업에도 수업명 보이게 변경<br></br>
                    3. 페이지 내 정보 변경
                    <br></br>
                  </div>
                  <br></br>
                  <div>
                    <strong>Hotfix@2023.05.27: </strong>
                    <br></br>
                    1. 일본 도쿄 =&gt; 대한민국 서울 리젼으로 서버와
                    데이터베이스 이전이 완료되었습니다.<br></br>
                  </div>
                  <br></br>
                  <div>
                    <strong>Hotfix@2023.05.29: </strong>
                    <br></br>
                    1. EC2 자동 배포가 활성화되었습니다 (테스트).<br></br>
                  </div>
                </div>
              </Collapse>
            </Alert>
          </figure>
        </div>
      </Container>
    </PageView>
  );
}
