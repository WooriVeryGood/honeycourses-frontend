import { Badge, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Course } from "../../../../types/course";
import { ChangeEvent } from "react";

interface CourseSidebarProps {
  searchCourses: Course[];
  searchInput: string;
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function CourseSearchbar({
  searchInput,
  handleSearchInputChange,
  searchCourses,
}: CourseSidebarProps) {
  return (
    <div>
      <input
        className="form-control mr-sm-2"
        type="search"
        placeholder="수업 검색해보기"
        aria-label="Search"
        style={{ width: "100%", height: "50px" }}
        value={searchInput}
        onChange={handleSearchInputChange}
      />

      {searchInput && (
        <div className="d-flex justify-content-center">
          <div style={{ width: "90%" }}>
            <ListGroup>
              {searchCourses.map((course) => (
                <Link
                  to={`/courses/view/${course.course_id}`}
                  key={course.course_id}
                  className="list-group-item"
                  target="_blank"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>
                      {course.course_name}{" "}
                      <Badge
                        bg="#236969"
                        style={{ backgroundColor: "#236969" }}
                      >
                        {course.course_category}
                      </Badge>{" "}
                      <Badge
                        bg="#65C18C"
                        style={{ backgroundColor: "#65C18C" }}
                      >
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
                      ) : null}
                    </h5>
                    <span className="text-body-secondary">
                      {course.course_credit}학점
                    </span>
                  </div>
                </Link>
              ))}
            </ListGroup>
          </div>
        </div>
      )}
    </div>
  );
}
