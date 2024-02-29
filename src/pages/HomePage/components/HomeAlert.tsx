import { useState } from "react";
import { Alert, Collapse } from "react-bootstrap";

export default function HomeAlert() {
  const [open, setOpen] = useState(false);
  return (
    <Alert key="update" variant="info">
      <Alert.Link href="#" onClick={() => setOpen(!open)}>
        &gt; 업데이트 내역 확인 (최신 업데이트: 2024.02.01)
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
            1. UI 전면적 리디자인.
            <br />
            2. 커뮤니티 베타 서비스 종료.
            <br />
            3. 강의평가 작성 이벤트 공지 추가.
          </div>
          <br />
          <div>
            <strong>Release@2024.01.20:</strong> <br></br>
            1. 강의평가 조회 UI 개선.
            <br />
            2. 제출버튼 반복 클릭시 신규 수업/강의평가가 반복적으로 올라가는
            문제 해결.
            <br />
          </div>
          <br />
          <div>
            <strong>Release@2024.02.01:</strong> <br></br>
            1. 1.1.0 버전 정식 릴리즈
            <br />
            2. 강의평가 수정/삭제 기능 추가
            <br />
            3. 강의 목록에서 리뷰 수 열람 가능, 강의 클릭 시 새 탭에서 열리도록
            변경
            <br />
            4. 커뮤니티 기능 정식 오픈
            <br />
            5. 내 정보 페이지 추가
            <br />
            6. 성적 조회 페이지 추가
            <br />
            <a href="https://velog.io/@railgunofpku/honeycourses2024winter">
              여기
            </a>
            에서 1.1.0 버전 개발 회고록을 읽어보세요!
          </div>
        </div>
      </Collapse>
    </Alert>
  );
}
