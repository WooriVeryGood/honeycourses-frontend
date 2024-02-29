import { api } from "../APIHandler";

interface addCourseProps {
  course_name: string;
  course_credit: string;
  course_category: string;
  kaikeYuanxi: string;
  isYouguan: number;
}

export async function getCourses() {
  try {
    const response = await api.get("/courses");
    return response.data;
  } catch (error) {
    console.error("Error fetching courses: " + error);
    throw error;
  }
}

export async function addCourse({
  course_name,
  course_credit,
  course_category,
  kaikeYuanxi,
  isYouguan,
}: addCourseProps) {
  try {
    const data = {
      course_name,
      course_credit,
      course_category,
      kaikeYuanxi,
      isYouguan,
    };
    const response = await api.post("/courses", data);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching courses: " + error);
    throw error;
  }
}
