import Linkify from "linkify-react";
import styles from "./FAQItem.module.css";
import { useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
type item = {
  id: number;
  question: string;
  answer: Array<string>;
};
interface FAQItemProps {
  items: Array<item>;
}
export default function FAQItem({ items }: FAQItemProps) {
  const [clickNum, setClickNum] = useState(0);
  const urlOptions = {
    target: "_blank",
  };
  useEffect(() => {
    setClickNum(0);
  }, [items]);
  return (
    <div className={styles.faqItemContainer}>
      {items.map((qna, i) => (
        <div key={i}>
          <div style={{ borderBottom: "1px solid rgba(176, 179, 188, .5)" }}>
            <div
              className={styles.questionWrapper}
              onClick={() => setClickNum(clickNum === qna.id ? 0 : qna.id)}
            >
              <div style={{ display: "flex" }}>
                <div className={styles.questionId}>{qna.id}</div>
                <div className={styles.question}>{qna.question}</div>
              </div>
              {clickNum === qna.id ? <SlArrowUp /> : <SlArrowDown />}
            </div>
          </div>

          {clickNum === qna.id && (
            <div className={styles.answerWrapper}>
              <div className={styles.answer}>
                {qna.answer.map((ans, i) => (
                  <div key={i}>
                    <div>
                      <div
                        style={{
                          margin: "5px 0",
                          padding: "5px 0",
                          wordBreak: "break-all",
                        }}
                      >
                        <Linkify options={urlOptions}>
                          {ans.replace(/<br\s*[/]?>/gi, "\n")}
                        </Linkify>
                        <br></br>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
