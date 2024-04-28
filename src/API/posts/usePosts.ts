import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./PostApi";
import { AxiosError } from "axios";

export function usePosts(pageNo: number, category: string = "") {
  const {
    isLoading,
    data: postData,
    error,
  } = useQuery({
    queryKey: ["posts", category, pageNo],
    queryFn: () => getPosts(pageNo, category),
    staleTime: 0,
    retry: (failCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404) return false; // 존재하지 않는 페이지/카테고리의 요청은 재시도하지 않음
      return failCount < 3;
    },
  });
  return {
    isLoading,
    error,
    posts: postData?.posts,
    noticePosts: postData?.notices,
    totalItemsCount: postData?.totalPostCount
  };
}
