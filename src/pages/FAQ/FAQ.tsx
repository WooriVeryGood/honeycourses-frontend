import { Container } from "react-bootstrap";
import PageView from "../PageView/PageView";
import styles from "./FAQ.module.css";
import QuickLink from "./components/QuickLink/QuickLink";
import { top5 } from "./components/FAQItem/top5.json";
import FAQItem from "./components/FAQItem/FAQItem";
import { faq } from "./components/FAQSection/faq.json";
import FAQSection from "./components/FAQSection/FAQSection";

export default function FAQ() {
  return (
    <div>
      <PageView>
        <Container>
          <div className={styles.faqContainer}>
            <div className={styles.title}>
              <h1>Hi!PKU</h1>
              <div>슬기로운 북대생활</div>
              <p>자주 들어가는 사이트, FAQ 한 번에 정리</p>
            </div>

            <div className={styles.sectionContainer}>
              <div className={styles.sectionTitle}>사이트 바로가기</div>
              <QuickLink />

              <div className={styles.sectionTitle}>자주 묻는 질문 TOP5</div>
              <FAQItem items={top5} />

              <div className={styles.sectionTitle}>FAQ</div>
              <FAQSection />
            </div>
          </div>
        </Container>
      </PageView>
    </div>
  );
}
