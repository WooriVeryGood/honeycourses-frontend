import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteReview } from "./ReviewApi";

interface VoteReviewProps {
  courseId: string | undefined;
  reviewId: number;
}

export function useVoteReview() {
  const queryClient = useQueryClient();
  const { mutate: voteSingleReview } = useMutation({
    mutationFn: async ({ courseId, reviewId }: VoteReviewProps) => {
      await voteReview(reviewId);
      return { courseId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.courseId],
      });
    },
    onError: () => {
      alert("리뷰 추천/추천 취소에 실패했습니다.");
    },
  });

  return { voteSingleReview };
}
