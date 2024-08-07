import PageView from "../PageView/PageView";
import Container from "react-bootstrap/Container";
import styles from "./AddCourse.module.css";
import AddCourseForm from "./components/AddCourseForm";

export default function AddCourse() {
  return (
    <PageView>
      <Container fluid className={styles.addCourseBox}>
        <div>
          <div>
            <h2 className={styles.addCourseTitle}>강의 추가</h2>
          </div>
        </div>
        <div>
          <div>
            <p className={styles.addCourseCaution}>
              강의를 추가할 때는 꼭 수업 명을 줄이지 않고 选课系统에 뜨는 대로
              풀네임으로 입력하고, 수업 종류가 올바른지 꼭 확인해 주세요.
              올바르게 입력하지 않으면 다른 학우들이 찾는데 어려움을 겪을 수도
              있어요.<br></br>
              <a
                href="https://dean.pku.edu.cn/service/web/courseSearch.php"
                target="_blank"
                rel="noreferrer"
              >
                이곳
              </a>
              에서 수업 이름, 분류, 중국유관 여부를 확인해주세요!
            </p>
          </div>
        </div>
        <AddCourseForm />
      </Container>
    </PageView>
  );
}
