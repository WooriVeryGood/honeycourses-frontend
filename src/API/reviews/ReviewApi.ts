import { Review } from "../../types/review";
import { api } from "../APIHandler";
import { AxiosError } from "axios";

export async function getReviews(courseId: string | undefined) {
  try {
    const [reviewResponse, nameResponse] = await Promise.all([
      api.get(`/courses/${courseId}/reviews`),
      api.get(`/courses/${courseId}/name`),
    ]);
    const reviews = reviewResponse.data.map((review: Review) => ({
      ...review,
    }));
    const names = nameResponse.data.course_name;

    return { reviews, names };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404) {
        console.log('404!!!')
        alert("존재하지 않는 수업입니다.");
    }
    console.error("Error fetching courses: " + error);
    throw error;
  }
}
