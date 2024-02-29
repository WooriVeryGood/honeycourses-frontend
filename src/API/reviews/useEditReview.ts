import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editReviewProps } from "../../types/editReview";
import { editReview } from "./ReviewApi";

export function useEditReview() {
  const queryClient = useQueryClient();
  const { mutate: editSingleReview } = useMutation({
    mutationFn: async ({
      reviewId,
      courseId,
      editedTitle,
      editedContent,
      editedInstructor,
      editedSemyr,
      editedGrade,
    }: { reviewId: number, courseId: string | undefined} & editReviewProps) => {
      await editReview(reviewId, {
        editedTitle,
        editedContent,
        editedInstructor,
        editedSemyr,
        editedGrade,
      });
      return { courseId };
    },
    onSuccess: (_, variables) => {
      alert("리뷰가 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.courseId],
      });
    },

    onError: () => {
      alert("리뷰 수정에 실패했습니다.");
    },
  });
  return { editSingleReview };
}
