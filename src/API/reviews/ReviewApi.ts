import { Review } from "../../types/review";
import { api } from "../APIHandler";
import { AxiosError } from "axios";
import { editReviewProps } from "../../types/editReview";
import { AddReviewProps } from "../../types/addReview";

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

export async function getCourseName(courseId: string | undefined) {
  try {
    let response = await api.get(`/courses/${courseId}/name`);
    const name = response.data.course_name;
    return name;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404) {
      alert("존재하지 않는 수업입니다.");
    }
    console.error("Error fetching courses: " + error);
    throw error;
  }
}

export async function addReview(courseId: string | undefined, {
  review_title,
  instructor_name,
  taken_semyr,
  review_content,
  grade,
}: AddReviewProps) {
  try {
    const data = {
      review_title,
      instructor_name,
      taken_semyr,
      review_content,
      grade,
    };
    const response = await api.post(`/courses/${courseId}/reviews`, data);
    console.log(response.data);
  } catch (error) {
    console.error("Error adding review: " + error);
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

export async function deleteReview(reviewId: number) {
  try {
    const response = await api.delete(`/courses/reviews/${reviewId}`);
    console.log(response);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

export async function voteReview(reviewId: number) {
  try {
    const response = await api.put(`/courses/reviews/${reviewId}/like`, null);
    console.log(response);
  } catch (error) {
    console.error("Error up/downvoting review:", error);
    throw error;
  }
}
