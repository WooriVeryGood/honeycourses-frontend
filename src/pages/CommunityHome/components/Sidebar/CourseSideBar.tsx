import { CategoryKey } from "../../../../types/post";
import PostCategoryButton from "./components/PostCategoryButton";

import styles from './CourseSideBar.module.css';

interface SidebarProps {
  selectedCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

const postCategories: CategoryKey[] = ["All", "공지", "자유", "질문", "중고거래", "구인"];

const Sidebar = (props: SidebarProps) => {
  return <div className={styles.comLeft}>
    <div className={styles.listLayout}>
      <div className="d-flex flex-wrap align-items-left">
        <h2>커뮤니티</h2>
      </div>

      <nav>
        <ul className={styles.categories}>
          {postCategories.map((category) => (
            <PostCategoryButton
            key={category}
            category={category}
            isSelected={props.selectedCategory === category}
            onClick={() => {
              props.onCategoryChange(category);
            }}
          />
          ))}
        </ul>
      </nav>
    </div>
  </div>;
};

export default Sidebar;