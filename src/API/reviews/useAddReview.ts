import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReview } from "./ReviewApi";
import { AddReviewProps } from "../../types/addReview";

export function useAddReview(courseId: string | undefined) {
  const queryClient = useQueryClient();
  const { mutate: createReview } = useMutation({
    mutationFn: ({
      courseId,
      reviewDetails,
    }: {
      courseId: string | undefined;
      reviewDetails: AddReviewProps;
    }) => addReview(courseId, reviewDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", courseId] });
      alert("리뷰 등록에 성공했습니다!");
      window.location.href=`/courses/view/${courseId}`;
    },
    onError: () => {
      alert("리뷰 등록에 실패했습니다.");
    },
  });

  return { createReview };
}
