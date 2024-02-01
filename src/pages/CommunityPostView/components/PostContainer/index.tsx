import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

import { Post } from "../../../../types/post";
import koreaTimeFormatter from "../../../../utils/koreaTimeFormatter";
import { WGButton, WGButtonVariant } from "../../../../components/WGButton/WGButton";
import WGTextInput from "../../../../components/WGTextInput/WGTextInput";
import { apiDelete, apiPost, apiPut } from "../../../API/APIHandler";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HttpError } from "../../../../types/error";
import { useAuthenticator } from "@aws-amplify/ui-react";

import "./styles.css";

interface PostContainerProps {
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post | null>>;
  isLoading: boolean;
  setIsLoading: (newValue: boolean) => void;
}

const PostContainer = (props: PostContainerProps) => {
  const { user } = useAuthenticator((context) => [context.user, context.route]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasRequestPostUpdate, setHasRequestPostUpdate] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const navigate = useNavigate();

  const requestLikePost = async () => {
    try {
      const response = await apiPut(`/community/${props.post.post_id}/like`, null);
      const liked = response.data.liked;
        alert(`게시글${liked ? "을 추천" : " 추천을 취소"}했습니다!`);
        props.post.liked = liked;
        props.post.post_likes = response.data.like_count;
        props.setPost((prevState) => {
          if (prevState === (undefined || null)) return prevState;
          return {
            ...prevState,
            liked: liked,
            post_likes: response.data.like_count,
          };
        });
    } catch (error) {
      console.error("Error like comment:", error);
    }
  };

  const handlePostReport = async () => {
    const reportMessage = window.prompt("신고 내용을 입력하세요:");
    if (reportMessage === null || reportMessage.trim() === "") {
      alert("신고가 취소되었습니다.");
      return;
    }
    try {
      const response = await apiPost(`/posts/${props.post.post_id}/report`, {
        message: reportMessage,
      });
      if (response.status === 201)
        alert("신고가 접수되었습니다.");
    } catch (error) {
      const err = error as HttpError;
      if (err.code === "ERR_BAD_REQUEST")
        alert("이미 신고한 게시글입니다.");
      console.error("Error reporting post:", error);
    }
  };

  const onUpdateButtonClick = () => {
    setIsEditMode(true);
    setNewPostTitle(props.post.post_title || "");
    setNewPostContent(props.post.post_content || "");
  };

  const requestPostDelete = async () => {
    const isDelete = window.confirm("게시글을 삭제할까요?");
    if (!isDelete) return;
    try {
      await apiDelete(`/community/${props.post.post_id}`).then((response) => {
        if (response.data.post_id === Number(props.post.post_id)) {
          alert("게시글을 삭제했습니다!");
          navigate(`/community`);
        }
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const requestPostUpdate = async () => {
    if (hasRequestPostUpdate)
      return;
    setHasRequestPostUpdate(true);
    try {
      const response = await apiPut(`/community/${props.post.post_id}`, {
        post_title: newPostTitle,
        post_content: newPostContent,
      });

      if (response.data) {
        alert("게시글을 수정했습니다!");
        setIsEditMode(false);
        window.location.reload();
      }
      setHasRequestPostUpdate(false);
    } catch (error) {
      console.error("Error updating post:", error);
      setHasRequestPostUpdate(false);
    }
  };

  const isMyPost = () => {
    return user.getUsername() === props.post.post_author;
  };

  return <Card className="detailedPostCard">
    <div className="detailedMainTop">
      <Card.Title className="detailedCardTitle" style={{display:"flex"}}>
        <Badge
          bg="#236969"
          style={{
            backgroundColor: "#236969",
            marginRight: "10px",
            height: "30px",
            fontSize:".8em"
          }}
        >
          {props.post.post_category}
        </Badge>
        <span style={{fontSize:".9em"}}>{props.post.reported ? "신고 누적으로 삭제된 게시물입니다." : props.post.post_title}</span>
      </Card.Title>
      <div className="detailedMainBottom">
        <div style={{ display: "flex" }}>
          <div className="detailedSharp">#{props.post.post_id}</div>
          <div className="detailedDate">
            {koreaTimeFormatter(props.post.post_time)}
            {props.post.updated ? " (수정됨)" : ""}
            <span
              style={{
                marginLeft: "8px",
                cursor: "pointer",
              }}
              onClick={handlePostReport}
            >
              &nbsp;신고하기
            </span>
          </div>
        </div>
        <div className={props.post.liked ? "onLikeButton" : "likeButton"}>
          <span onClick={requestLikePost} style={{display:"flex",alignItems:"center"}}>
            <img
              src={
                props.post.liked ?
                "/images/likeGreen.svg" :
                "/images/likeWhiteSolidBlack.svg"
              }
              alt="likes-icon"
              style={{
                marginRight: "5px",
                width: "20px",
                height: "20px",
              }}
            />
            <span className={props.post.liked ? "likeCount" : ""}>
              {props.post.post_likes}
            </span>
          </span>
        </div>
      </div>
    </div>

    <Card.Body className="text-start">
      {isEditMode ? (
        <>
          <WGTextInput
            text={newPostTitle}
            onTextChange={setNewPostTitle}
            placeholder="제목"
          />
          <WGTextInput
            textarea="textarea"
            text={newPostContent}
            onTextChange={setNewPostContent}
            placeholder="내용"
          />
          <div style={{ textAlign: "right" }}>
            <WGButton
              text="제출"
              variant={WGButtonVariant.PRIMARY}
              diabled={hasRequestPostUpdate}
              action={requestPostUpdate}
            />
            {" "}
            <WGButton
              text="취소"
              variant={WGButtonVariant.SECONDARY}
              action={() => setIsEditMode(false)}
            />
          </div>
        </>
      ) : (
        <>
          {!props.post.reported && isMyPost() && (
            <div style={{ textAlign: "right" }}>
              <WGButton
                text="수정"
                variant={WGButtonVariant.PRIMARY}
                action={onUpdateButtonClick}
              />
              {" "}
              <WGButton
                text="삭제"
                variant={WGButtonVariant.SECONDARY}
                action={requestPostDelete}
              />
            </div>
          )}
          <Card.Text className="cardText">
            {props.post.reported ? "신고 누적으로 삭제된 게시물입니다." : props.post.post_content.replace(/<br\s*[/]?>/gi, "\n")}
          </Card.Text>
        </>
      )}
    </Card.Body>
  </Card>
};

export default PostContainer;