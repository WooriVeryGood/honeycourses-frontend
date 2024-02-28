import { Review } from "../../types/review";
import { api } from "../APIHandler";
import { AxiosError } from "axios";
import { editReviewProps } from "../../types/editReview";

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
      alert("존재하지 않는 수업입니다.");
    }
    console.error("Error fetching courses: " + error);
    throw error;
  }
}

export async function editReview(
  reviewId: number,
  {
    editedTitle,
    editedContent,
    editedInstructor,
    editedSemyr,
    editedGrade,
  }: editReviewProps
) {
  try {
    const response = await api.put(`/courses/reviews/${reviewId}`, {
      review_title: editedTitle,
      review_content: editedContent,
      instructor_name: editedInstructor,
      taken_semyr: editedSemyr,
      grade: editedGrade,
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error editing courses: " + error);
    throw error;
  }
}
