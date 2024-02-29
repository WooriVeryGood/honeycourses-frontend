import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "./ReviewApi";

interface DeleteReviewProps {
  courseId: string | undefined;
  reviewId: number;
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { mutate: deleteSingleReview } = useMutation({
    mutationFn: async ({ courseId, reviewId }: DeleteReviewProps) => {
      if (window.confirm("리뷰를 삭제하시겠습니까?")) {
        await deleteReview(reviewId);
        return { courseId };
      }
    },
    onSuccess: (_, variables) => {
      alert("리뷰가 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.courseId],
      });
    },
    onError: () => {
      alert("리뷰 삭제에 실패했습니다.");
    },
  });

  return { deleteSingleReview };
}
