import { useState } from "react";
import styles from "./FAQSection.module.css";
import { faq } from "./faq.json";
import FAQItem from "../FAQItem/FAQItem";
export default function FAQSection() {
  const [category, setCategory] = useState("학기 시작 준비");

  return (
    <>
      <div className={styles.faqBtnWrapper}>
        {faq.map((cat, i) => (
          <button
            className={styles.faqBtn}
            key={i}
            onClick={() => setCategory(cat.category)}
            style={{
              backgroundColor: `${
                category === cat.category ? " #B6E4C5" : "transparent"
              }`,
            }}
          >
            {cat.category}
          </button>
        ))}
      </div>
      {faq
        .filter((obj) => obj.category === category)
        .map((f, i) => (
          <FAQItem key={i} items={f.qna} />
        ))}
    </>
  );
}
