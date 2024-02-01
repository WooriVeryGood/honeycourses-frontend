import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";

export default function TermsConditions() {
  return (
    <PageView>
      <Container>
        <p className="lead">
          <strong>개인정보 수집 약관</strong>
        </p>
        <hr className="divider" style={{ marginTop: "10px" }} />
        <ul>
          <li>
            <strong>1. 개인정보의 수집 목적 및 이용</strong>
            <ul>
              <li>
                본 웹사이트는 디도스 공격, 도배 등을 방지하기 위해 유저의 접속 IP 기록, 접속 기기와 브라우저 정보, 접속 시간 기록을 자동으로 수집합니다.
              </li>
              <li>
                수집된 개인정보는 웹사이트의 안전한 운영과 서비스 품질 향상을 위해 사용됩니다.
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>2. 개인정보의 보유 및 이용 기간</strong>
            <ul>
              <li>
                수집된 개인정보는 서비스 운영 목적을 달성한 후 즉시 파기됩니다.
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>3. 동의의 의사표시</strong>
            <ul>
              <li>
                본 웹사이트를 사용하는 경우, 개인정보 수집 및 이용에 동의한 것으로 간주됩니다.
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>4. 개인정보의 파기</strong>
            <ul>
              <li>
                수집된 개인정보는 수집 목적이 달성된 후 즉시 파기됩니다.
              </li>
              <li>
                파기된 개인정보는 복구 및 복원되지 않도록 안전하게 처리됩니다.
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>5. 개인정보의 제공 및 공유</strong>
            <ul>
              <li>
                본 웹사이트는 산하 서비스 약관에 명시되지 않은 한 수집된 개인정보를 제3자에게 제공하거나 공유하지 않습니다.
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>6. 개인정보의 안전성 확보 조치</strong>
            <ul>
              <li>
                본 웹사이트는 개인정보보호를 위해 보안조치를 취하고 있습니다.
              </li>
              <li>
                개인정보는 로그의 방식으로 안전하게 저장되며, 무단 접근, 누출, 변조, 파기 등을 방지하기 위해 필요한 조치를 취합니다.
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>7. 이용자의 권리와 행사 방법</strong>
            <ul>
              <li>
                개인정보주체는 개인정보 수집 및 이용에 대한 동의를 철회할 수 있습니다.
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>8. 개인정보 관련 문의처</strong>
            <ul>
              <li>
                개인정보보호에 관한 문의사항이 있으신 경우, 다음 연락처로 문의해주시기 바랍니다.
              </li>
              <li>
                이메일: percyjang.dev@outlook.com
              </li>
            </ul>
          </li>
          <br></br>
          <li>
            <strong>9. 기타</strong>
            <ul>
              <li>
                본 약관은 관련 법령 및 정책의 변경에 따라 변경될 수 있습니다. 변경 시 본 웹사이트를 통해 사전 공지할 것입니다.
              </li>
            </ul>
          </li>
        </ul>
      </Container>
    </PageView>
  );
}
