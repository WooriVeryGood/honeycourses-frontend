import { Badge } from "react-bootstrap";
import { Course } from "../../../../types/course";
import { Link } from "react-router-dom";
import styles from "./CourseCard.module.css";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/courses/view/${course.course_id}`}
      key={course.course_id}
      className="list-group-item list-group-item-action"
    >
      <div className="d-flex justify-content-between align-items-center">
        <h5 className={styles.courseSet}>
          <div>
            <Badge bg="#236969" style={{ backgroundColor: "#236969" }}>
              {course.course_category}
            </Badge>{" "}
            <Badge bg="#65C18C" style={{ backgroundColor: "#65C18C" }}>
              {course.kaikeYuanxi}
            </Badge>{" "}
            {course.isYouguan ? (
              <Badge
                className="rounded-pill"
                bg="#FF7BA9"
                style={{ backgroundColor: "#489CC1" }}
              >
                중국유관
              </Badge>
            ) : null}{" "}
            <Badge bg="#65C18C" style={{ backgroundColor: "#279EFF" }}>
              리뷰 {course.reviewCount}개
            </Badge>{" "}
          </div>
          <div className={styles.courseName}>{course.course_name} </div>
        </h5>
        <span className="text-body-secondary">{course.course_credit}학점</span>
      </div>
    </Link>
  );
}
