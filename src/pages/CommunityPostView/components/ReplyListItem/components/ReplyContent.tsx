import { Card } from "react-bootstrap";
import { Reply } from "../../../../../types/reply";

interface ReplyContentProps {
  reply: Reply;
}

const ReplyContent = (props: ReplyContentProps) => {
  return <Card.Text>
    {props.reply.reported ? (
      <em style={{ opacity: 0.7 }}>
        [신고 누적으로 삭제된 답글입니다.]
      </em>
    ) : (
      props.reply.reply_content
    )}
  </Card.Text>
};

export default ReplyContent;