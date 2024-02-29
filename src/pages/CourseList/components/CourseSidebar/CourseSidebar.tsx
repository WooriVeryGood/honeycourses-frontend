import styles from "./CourseSidebar.module.css";

interface CourseSidebarProps {
  selectedCategory: string;
  showYouguan: boolean;
  handleSelectCategory: (arg0: string) => void;
  handleShowYouguan: () => void;
}

export default function CourseSidebar({
  selectedCategory,
  showYouguan,
  handleSelectCategory,
  handleShowYouguan,
}: CourseSidebarProps) {
  return (
    <div className={styles.CourseListLeft}>
      <div className={styles.listLayout}>
        <div>
          <h2>강의 목록</h2>
        </div>
        <nav>
          <ul className={styles.categories}>
            <li className="nav-item">
              <button
                className={`navLink nav-link btn ${
                  selectedCategory === "All" && !showYouguan
                    ? styles.categorySelected
                    : ""
                }`}
                onClick={() => handleSelectCategory("All")}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`navLink nav-link btn ${
                  selectedCategory === "通选课" ? styles.categorySelected : ""
                }`}
                onClick={() => handleSelectCategory("通选课")}
              >
                通选课
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`navLink nav-link btn ${
                  selectedCategory === "体育课" ? styles.categorySelected : ""
                }`}
                onClick={() => handleSelectCategory("体育课")}
              >
                体育课
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`navLink nav-link btn ${
                  selectedCategory === "专业课" ? styles.categorySelected : ""
                }`}
                onClick={() => handleSelectCategory("专业课")}
              >
                专业课
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`navLink nav-link btn ${
                  selectedCategory === "公选课" ? styles.categorySelected : ""
                }`}
                onClick={() => handleSelectCategory("公选课")}
              >
                公选课
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`navLink nav-link btn ${
                  selectedCategory === "英语课" ? styles.categorySelected : ""
                }`}
                onClick={() => handleSelectCategory("英语课")}
              >
                英语课
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`navLink nav-link btn ${
                  showYouguan ? styles.categorySelected : ""
                }`}
                onClick={handleShowYouguan}
              >
                중국유관
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
