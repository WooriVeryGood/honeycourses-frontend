import { Card } from "react-bootstrap";
import { Reply } from "../../../../../types/reply";
import Linkify from "linkify-react";

interface ReplyContentProps {
  reply: Reply;
}
const urlOptions = {
  target: "_blank",
};

const ReplyContent = (props: ReplyContentProps) => {
  return (
    <Card.Text>
      {props.reply.reported ? (
        <em style={{ opacity: 0.7 }}>[신고 누적으로 삭제된 답글입니다.]</em>
      ) : (
        <Linkify options={urlOptions}>{props.reply.reply_content}</Linkify>
      )}
    </Card.Text>
  );
};

export default ReplyContent;
