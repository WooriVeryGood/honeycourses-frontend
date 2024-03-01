import { Badge, Card } from "react-bootstrap";
import { Post } from "../../../../types/post";

import koreaTimeFormatter from "../../../../utils/koreaTimeFormatter";

import styles from './PostListItem.module.css';

interface PostListItemProps {
  isNotNotice: boolean;
  post: Post;
  linkToPostView: (postId: number) => void;
}

const PostListItem = (props: PostListItemProps) => {
  return <Card className={props.isNotNotice ? styles.postCard : styles.postCardNotice}
    onClick={() => props.linkToPostView(props.post.post_id)}
    style={{ textDecoration: "none", color: "inherit", cursor: "pointer"}}>
      <Card.Body className="text-start">
        <Card.Title
          style={{
            color: "#43A680",
            fontWeight: "800",
            display: "flex",
          }}
        >
          <Badge
            bg="#236969"
            style={{
              backgroundColor: props.isNotNotice ? "#236969" : "#489CC1",
              marginRight: "10px",
              height: "25px",
            }}
          >
            {props.post.post_category}
          </Badge>
          <div>{props.post.reported ? "신고 누적으로 삭제된 게시물입니다." : props.post.post_title}</div>
        </Card.Title>

        {props.isNotNotice ?
          <Card.Text
            className={styles.postContent}
            dangerouslySetInnerHTML={{
              __html: props.post.reported ? "신고 누적으로 삭제된 게시물입니다." : props.post.post_content,
            }}
          /> : <></>
        }

        <div
          className={styles.dateNpostID}
          style={{ display: "flex" }}
        >
          <div style={{ display: "flex" }}>
            <div className={styles.sharp}>#{props.post.post_id}</div>
            <div> {koreaTimeFormatter(props.post.post_time)} </div>
          </div>
          {props.isNotNotice ?
            <div className={styles.likeComment}>
              <img
                src="../images/like.svg"
                alt="likes-icon"
                style={{
                  marginRight: "5px",
                  width: "20px",
                  height: "20px",
                }}
              />
              <span>{props.post.post_likes}</span>{" "}
              <img
                src="../images/comments.svg"
                alt="comments-icon"
                style={{
                  marginLeft: "10px",
                  marginRight: "5px",
                  width: "15px",
                  height: "15px",
                }}
              />
              <span>{props.post.post_comments}</span>{" "}
            </div> : <></>
          }
        </div>
      </Card.Body>
    </Card>;
};

export default PostListItem;