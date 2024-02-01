import { Reply } from "../../../../types/reply";
import ReplyListItem from "../ReplyListItem";
import { COMMENT_BACK_COLORS } from "../../../../constants/colors";
import { RANDOM_NICKNAMES } from "../../../../constants/nicknames";
import { Comment } from "../../../../types/comment";


interface ReplyListProps {
  postAuthor: string;
  replies: Reply[];
  commentAuthors: string[];
  isCommentUpdate: boolean;
  setIsCommentUpdate: (newValue: boolean) => void;
  updateComment: Comment | null;
  setUpdateComment: React.Dispatch<React.SetStateAction<Comment | null>>;
  requestLikeComment: (replyId: number) => void;
}

const ReplyList = (props: ReplyListProps) => {

  const getCommentBackgroundColor = (
    commentAuthor: string,
    postAuthor: string
  ): string => {
    if (commentAuthor === postAuthor)
      return "white";
    const authorPosition = props.commentAuthors.indexOf(commentAuthor);
    if (authorPosition === -1)
      return "white";
    return COMMENT_BACK_COLORS[authorPosition % COMMENT_BACK_COLORS.length];
  };

  const getAuthorName = (author: string): string => {
    if (author === props.postAuthor)
      return "작성자";

    const authorPosition = props.commentAuthors.indexOf(author);
    if (authorPosition === -1)
      return "Unknown";

    return RANDOM_NICKNAMES[authorPosition % RANDOM_NICKNAMES.length];
  };

  return <div className="replies">
    {props.replies.map((reply) => (
      <ReplyListItem
        key={reply.reply_id}
        reply={reply}
        backgroundColor={getCommentBackgroundColor(
          reply.reply_author,
          props.postAuthor
        )}
        replyAuthor={getAuthorName(reply.reply_author)}
        isCommentUpdate={props.isCommentUpdate}
        setIsCommentUpdate={props.setIsCommentUpdate}
        updateComment={props.updateComment}
        setUpdateComment={props.setUpdateComment}
        requestLikeComment={() => props.requestLikeComment(reply.reply_id)}
      />
    ))}
  </div>
  
};

export default ReplyList;