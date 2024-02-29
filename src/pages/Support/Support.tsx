import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import styles from "./Support.module.css";
import { useEffect, useState } from "react";

export default function Support() {
  const [cardBtnNum, setCardBtnNum] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageView>
      <Container className={styles.supportContainer}>
        {/* 페이지 헤더부분 */}
        <div className={styles.supportTop}>
          <div className={styles.supportHeader}>
            <p className={styles.lead}>
              저희 웹사이트,<br></br> 만족스럽게 사용하고 계신가요?
            </p>

            <div className={styles.subTitle} style={{ marginTop: "20px" }}>
              사이트가 마음에 드셨고, 앞으로의 운영을 <span className={styles.hl}>지원해주고 싶으신가요?</span><br></br><br></br>
              밤샘 개발로 고생한 저희 팀 개발자 학우들에게 <span className={styles.hl}>나이챠라도
                한잔 </span>사주시고 싶으신가요?<br></br><br></br><br></br>
            </div>
          </div>
          <div className={styles.hr}>
            <Image
              src="/images/free-icon-send-message-3682321.png"
              alt="message"
              width={30}
              fluid
            />
            <div style={{ width: "100%", height: "30px" }}>
              <hr style={{ border: "none", borderTop: "3px dotted blue", color: "#fff", backgroundColor: "#fff", height: "1px", width: "100%", margin: "14px auto" }}></hr>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className={styles.mainBox} >
          {/* 카드 내용 */}
          <div className={styles.buttons}>
            <button className={cardBtnNum === 0 ? styles.clickedSupportBtn : styles.supportBtn}
              onClick={() => setCardBtnNum(0)} style={{color:"black"}}>Support</button>
            <button className={cardBtnNum === 1 ? styles.clickedCardBtn : styles.cardBtn}
              onClick={() => setCardBtnNum(1)}>1</button>
            <button className={cardBtnNum === 2 ? styles.clickedCardBtn : styles.cardBtn}
              onClick={() => setCardBtnNum(2)}>2</button>
            <button className={cardBtnNum === 3 ? styles.clickedCardBtn : styles.cardBtn}
              onClick={() => setCardBtnNum(3)}>3</button>
          </div>
          <div className={styles.cards}>
            <div className={styles.qr} style={{ display: cardBtnNum === 0 ? "" : "none" }}>
              <Image
                src="/images/donateCode.png"
                alt="왜 너만 답받냐고"
                fluid
              />
            </div>

            <div className={styles.firstBox} style={{ display: cardBtnNum === 1 ? "flex" : "none" }}>
              <div>
                <div className={styles.myCircle2}></div>
                <div className={styles.myCircle1}></div>

                <strong>
                  지속적으로 서비스를 이어나갈 수 있도록, 학우 여러분의 도움이
                  필요해요!
                </strong>
                <br></br>
                <p>
                  우리잘했조는 앞으로도 학우분들을 위해 웹사이트의 신규 기능 개발,
                  유지보수 등에 힘 쓸 예정입니다. 현 팀원이 졸업하더라도, 몇년이고
                  저희 학교에 한국인 유학생이 남아 있는 한 웹사이트가 유지될 수
                  있도록 말이죠!
                </p>
              </div>
            </div>

            <div className={styles.secondBox} style={{ display: cardBtnNum === 2 ? "flex" : "none" }}>
              <div>
                <strong>
                  북경대학교 한국인 학우분들을 위해 열심히 개발되고 있는 본
                  웹사이트는, 현재 <span className={styles.bottomDotted}> 개발팀장의 사비로 </span>전적 운영되고 있습니다.
                </strong>
                <ul>
                  <li>
                    현재 본 웹사이트는 AWS의 서울 리전 EC2 인스턴스를 서버로,
                    RDS를 데이터베이스 서비스로 이용하고 있습니다.
                  </li>
                  <li>
                    현 시점에서는 AWS가 1년간 제공하는 프리 티어를 사용해 약 월
                    5~10달러의 운영비가 나가고 있으며, 2024년 5월부터는 약 월
                    20~50달러의 운영비가 연 13달러의 도메인 이용 비용과 함께 지출될
                    것으로 예정됩니다.{" "}
                  </li>
                  <li>
                    이에 따라 본 웹사이트는 학우 여러분들을 위해 만들어진 공익 목적
                    서비스이지만, 시간이 지속될수록 지원이 없으면 운영이 어려워질
                    전망입니다.
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.thirdBox} style={{ display: cardBtnNum === 3 ? "flex" : "none" }}>
              <div>
                <strong>
                  다시 한번, 기부 여부와 상관 없이 이 페이지를 찾아와주시고,
                  저희를 응원해주시는 모든 학우분들께 감사드립니다! 💓
                </strong>
                <ul>
                  <li>
                    학우분들께 기부받은 소중한 예산은, 웹사이트 운영 비용과 저희 팀
                    개발자 학우들의 나이챠/밤샘개발용 에너지 음료 등 구매 비용으로
                    소중하게 사용될 예정입니다. 기부자 여러분은 언제나 저희 팀원을
                    찾아 기부금 사용 내역을 요청 & 확인하실 수 있습니다.
                  </li>
                  <br></br>
                  <li>
                    QR코드를 통해 기부해주실 때, <span className={styles.hl2}> 备注에 학우님의 이름/원하는
                      닉네임을 </span> 같이 적어주신다면, 저희의 작은 감사의 뜻으로 사이트에 <span className={styles.hl2}>감사 섹션을</span> 만들어 학우님의 이름/닉네임을 적어드릴 예정입니다
                    :&gt;
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </Container>
    </PageView >
  );
}
