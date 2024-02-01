import koreaTimeFormatter from "../../../../../utils/koreaTimeFormatter";

interface CommentHeaderProps {
  backgroundColor: string;
  author: string;
  updated: boolean;
  commentTime: string;
}

const CommentHeader = (props: CommentHeaderProps) => {
  return <div className="cardHeader">
      <div
        className="cardCircle"
        style={{ backgroundColor: props.backgroundColor }}
      >
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
      <span
        className="author"
        style={{
          position: "relative",
          display: "inline-block",
          boxShadow: `inset 0 -10px ${props.backgroundColor}`,
        }}
      >
        {props.author}
      </span>
      <span className="date">
        {koreaTimeFormatter(props.commentTime)}
        {props.updated ? " (수정됨)" : ""}
      </span>
    </div>
    </div>
};

export default CommentHeader;