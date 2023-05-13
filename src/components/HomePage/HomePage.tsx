import PageView from "../PageView/PageView";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Alert from 'react-bootstrap/Alert';

// @todo 애니메이션 효과
export default function HomePage() {
  return (
    <PageView>
      <Container fluid className="justify-content-center align-items-center text-center" style={{paddingTop:"90px"}}>
        <div>
          <Image
            src="/images/wtf.png"
            alt="Responsive image"
            width={"288px"}
            height={"102px"}
            fluid
          />
          <h1 className="display-5"><strong>답변, 받으셨나요?</strong></h1>
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
              <em>답변, 받으셨나요? 는 북경대학교 한국인 유학생들을 위한 강의 정보공유 웹사이트입니다.</em>
            </p>
           
      
        <Alert key='info' variant='info'>
          현재 개발 진행중인 웹사이트이며, 테스트 단계에 있습니다. 정식 배포 후엔 현재 게시된 평가들이 모두 삭제될 예정입니다.<br></br>
          <Alert.Link href="/about">About</Alert.Link>{' '}페이지를 참고해주세요.
        </Alert>
  

          </figure>
        </div>
      </Container>
    </PageView>
  );
}
