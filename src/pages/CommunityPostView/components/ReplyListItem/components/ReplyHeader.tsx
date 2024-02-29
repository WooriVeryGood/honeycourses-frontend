import koreaTimeFormatter from "../../../../../utils/koreaTimeFormatter";
import styles from './ReplyHeader.module.css';

interface ReplyHeaderProps {
  backgroundColor: string;
  author: string;
  updated: boolean;
  replyTime: string;
};

const ReplyHeader = (props: ReplyHeaderProps) => {
  return <div className={styles.cardHeader}>
    <div
      className="cardCircle"
      style={{ backgroundColor: props.backgroundColor }}
    ></div>

    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        className={styles.author}
        style={{
          position: "relative",
          display: "inline-block",
          boxShadow: `inset 0 -10px ${props.backgroundColor}`,
        }}
      >
        {props.author}
      </span>

      <span className={styles.date}>
        {koreaTimeFormatter(props.replyTime)}
        {props.updated ? " (수정됨)" : ""}
      </span>
    </div>
  </div>
};

export default ReplyHeader;