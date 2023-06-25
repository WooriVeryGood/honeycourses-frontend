import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";
import Image from "react-bootstrap/Image";

export default function Support() {
  return (
    <PageView>
      <Container>
        <p className="lead">
          <strong>저희 웹사이트, 만족스럽게 사용하고 계신가요?</strong>
        </p>
        <hr className="divider" style={{ marginTop: "10px" }} />
        <p>
          <strong>
            💸 북경대학교 한국인 학우분들을 위해 약 2달간 열심히 개발된 본
            웹사이트는, 현재 개발팀장의 사비로 전적 운영되고 있습니다.
          </strong>
          <ul>
            <br></br>
            <li>
              현재 본 웹사이트는 AWS의 EC2 인스턴스와 로드 밸런서를 서버로,
              AWS의 RDS를 데이터베이스 서비스로 이용하고 있습니다.
            </li>
            <br></br>
            <li>
              현 시점에서는 AWS가 1년간 제공하는 프리 티어를 사용해 약 월
              5~10달러의 운영비가 나가고 있으며, 2024년 5월부터는 약 월
              20~50달러의 운영비가 연 13달러의 도메인 이용 비용과 함께 지출될
              것으로 예정됩니다.{" "}
            </li>
            <br></br>
            <li>
              이에 따라 본 웹사이트는 학우 여러분들을 위해 만들어진 공익 목적
              서비스이지만, 시간이 지속될수록 지원이 없으면 운영이 어려워질
              전망입니다.
            </li>
          </ul>
        </p>
        <br></br>
        <p>
          <strong>
            🙏 지속적으로 서비스를 이어나갈 수 있도록, 학우 여러분의 도움이
            필요해요!
          </strong>
          <ul>
            <br></br>
            <li>
              우리잘했조는 앞으로도 학우분들을 위해 웹사이트의 신규 기능 개발,
              유지보수 등에 힘 쓸 예정입니다. 현 팀원이 졸업하더라도, 몇년이고
              저희 학교에 한국인 유학생이 남아 있는 한 웹사이트가 유지될 수
              있도록 말이죠!
            </li>
            <br></br>
            <li>
              사이트가 마음에 드셨고, 앞으로의 운영을 지원해주고 싶으신가요?
              아니면 밤샘 개발로 고생한 저희 팀 개발자 학우들에게 나이챠라도
              한잔 사주시고 싶으신가요? 그런 학우분이 계시다면, 아래의 위챗페이
              QR코드를 통해 감사한 마음으로 기부를 받고 있습니다!
            </li>
            <div className="d-flex justify-content-center">
              <Image
                src="/images/donateCode.jpg"
                alt="왜 너만 답받냐고"
                width={300}
                style={{ marginTop: "20px" }}
                fluid
              />
            </div>
            <br></br>
            <li>
              학우분들께 기부받은 소중한 예산은, 웹사이트 운영 비용과 저희 팀
              개발자 학우들의 나이챠/밤샘개발용 에너지 음료 등 구매 비용으로
              소중하게 사용될 예정입니다. 기부자 여러분은 언제나 저희 팀원을
              찾아 기부금 사용 내역을 요청 & 확인하실 수 있습니다.
            </li>
            <br></br>
            <li>
              아래 코드를 통해 기부해주실 때, 备注에 학우님의 이름/원하는
              닉네임을 같이 적어주신다면, 저희의 작은 감사의 뜻으로 사이트에
              감사 섹션을 만들어 학우님의 이름/닉네임을 적어드릴 예정입니다
              :&gt;
            </li>
            <br></br>
            <li>
              <strong>
                다시 한번, 기부 여부와 상관 없이 이 페이지를 찾아와주시고,
                저희를 응원해주시는 모든 학우분들께 감사드립니다! 💓
              </strong>
            </li>
          </ul>
        </p>
      </Container>
    </PageView>
  );
}
