import { useQuery } from "@tanstack/react-query";
import { getReviews } from "./ReviewApi";
import { AxiosError } from "axios";

export function useReviews(courseId: string | undefined) {
  const {
    isLoading,
    data: reviewData,
    error,
  } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => getReviews(courseId),
    staleTime: 5 * 60 * 1000,
    retry: (failCount, error) => {
        const axiosError = error as AxiosError;
        if(axiosError?.response?.status === 404) return false;
        return failCount < 3;
    },
  });

  return { isLoading, error, reviews: reviewData?.reviews, course_name: reviewData?.names };
}
