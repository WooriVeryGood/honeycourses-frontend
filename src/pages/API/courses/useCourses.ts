import { useQuery } from "@tanstack/react-query";
import { getCourses } from "./CourseApi";
import { api, apiGet } from "../APIHandler";

export function useCourses() {
  const {
    isLoading,
    data: courses,
    error,
  } = useQuery({ queryKey: ["courses"], queryFn: getCourses, staleTime: 5*60*1000});

  return { isLoading, error, courses };
}
