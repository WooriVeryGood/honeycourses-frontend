import Paging from "../../../Paging/Paging";
import PostList from "./components/PostList";
import { CategoryKey, Post } from "../../../../types/post";
import WritePostButton from "./components/WritePostButton";

import "./styles.css";

interface PostContainerProps {
  currentPostCategory: CategoryKey;
  posts: Post[];
  noticePosts: Post[];
  linkToPostView: (postId: number) => void;
  currentPage: number;
  totalPostsCount: number;
  setPage: (page: number) => void;
}

const PostContainer = (props: PostContainerProps) => {
  const filteredPosts = (props.currentPostCategory === "All") ?
      props.posts :
      props.posts.filter((post) => post.post_category === props.currentPostCategory);

  return <div className="comRight">
    <div className="rightHeader">
      {props.currentPostCategory}
      <WritePostButton />
    </div>
      <div className="groupReviews">
        <PostList
          isNotNotice={false}
          posts={props.noticePosts}
          linkToPostView={props.linkToPostView}
        />
      </div>

      <div className="groupReviews">
        <PostList
          isNotNotice={true}
          posts={filteredPosts}
          linkToPostView={props.linkToPostView}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Paging
            page={props.currentPage}
            count={props.totalPostsCount}
            setPage={props.setPage}
          />
        </div>
      </div>
    </div>
};

export default PostContainer;