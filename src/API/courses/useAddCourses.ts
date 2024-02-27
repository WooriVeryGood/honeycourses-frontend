import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCourse } from "./CourseApi";
import { useNavigate } from "react-router-dom";

export function useAddCourses() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: createCourse,
  } = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert("수업 등록에 성공했습니다!");
      navigate(`/courses`);
    },
    onError: () => {
        alert("수업 등록에 실패했습니다.");
    }
  });
  return { createCourse };
}
