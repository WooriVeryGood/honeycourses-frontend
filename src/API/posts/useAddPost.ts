import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addPostProps } from "../../types/addPost";
import { addPost } from "./PostApi";

export function useAddPost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: createPost } = useMutation({
    mutationFn: ({ post_title, post_content, post_category }: addPostProps) =>
      addPost({ post_title, post_content, post_category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("게시글 등록에 성공했습니다!");
      navigate(`/community`);
    },
    onError: () => {
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });
  return { createPost };
}
