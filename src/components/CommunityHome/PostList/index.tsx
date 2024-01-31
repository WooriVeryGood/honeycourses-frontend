import { Post } from "../types/post";
import PostListItem from "../PostListItem";

interface PostListProps {
  isNotNotice: boolean;
  posts: Post[];
  linkToPostView: (postId: number) => void;
}

const PostList = (props: PostListProps) => {
  return <>
    {props.posts.map((post) => {
      return <PostListItem
        key={post.post_id}
        isNotNotice={props.isNotNotice}
        post={post}
        linkToPostView={props.linkToPostView}
      />
    })}
  </>;
};

export default PostList;