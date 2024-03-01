import { useQuery } from "@tanstack/react-query";
import { getReviews } from "./ReviewApi";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export function useReviews(courseId: string | undefined) {
  const [noRecentReviews, setNoRecentReviews] = useState(false);
  const {
    isLoading,
    data: reviewData,
    error,
  } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => getReviews(courseId),
    staleTime: 5 * 60 * 1000,
    retry: (failCount, error) => {
        const axiosError = error as AxiosError<{message: string}>;
        if(axiosError?.response?.status === 404 || axiosError?.response?.status === 400) return false; // 존재하지 않는 강의는 재시도 하지 않음
        return failCount < 3;
    },
  });

  useEffect(() => {
    if (error) {
      const axiosError = error as AxiosError<{message: string}>;
      if (axiosError.response?.status === 400 && axiosError.response?.data?.message === "최근 6개월 동안 리뷰를 작성하지 않았습니다.") {
        setNoRecentReviews(true);
      } else {
        setNoRecentReviews(false);
      }
    }
  }, [error]);

  return { isLoading, error, reviews: reviewData?.reviews, course_name: reviewData?.names, noRecentReviews };
}
