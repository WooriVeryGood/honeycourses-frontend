import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCourseName } from "./ReviewApi";

export function useCourseName(courseId: string | undefined) {
  const {
    isLoading,
    data: course_name,
    error,
  } = useQuery({
    queryKey: ["courseName", courseId],
    queryFn: () => getCourseName(courseId),
    staleTime: 10 * 60 * 1000,
    retry: (failCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404) return false; // 존재하지 않는 강의는 재시도 하지 않음
      return failCount < 3;
    },
  });
  return { isLoading, course_name, error };
}
