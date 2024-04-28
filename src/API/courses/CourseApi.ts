import { api } from "../APIHandler";

interface addCourseProps {
  course_name: string;
  course_credit: string;
  course_category: string;
  kaike_yuanxi: string;
  is_youguan: number;
}

export async function getCourses() {
  try {
    const response = await api.get("/courses");
    return response.data.courses;
  } catch (error) {
    console.error("Error fetching courses: " + error);
    throw error;
  }
}

export async function addCourse({
  course_name,
  course_credit,
  course_category,
  kaike_yuanxi,
  is_youguan,
}: addCourseProps) {
  try {
    const data = {
      course_name,
      course_credit,
      course_category,
      kaike_yuanxi,
      is_youguan,
    };
    const response = await api.post("/courses", data);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching courses: " + error);
    throw error;
  }
}
