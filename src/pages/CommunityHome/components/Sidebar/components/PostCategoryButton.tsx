import { CategoryKey } from "../../../../../types/post";

interface Props {
  category: CategoryKey;
  isSelected: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const PostCategoryButton = (props: Props) => {
  return <li className="nav-item">
    <button
      className={`navLink nav-link btn ${
        props.isSelected ? "btn-primary" : ""
      }`}
      onClick={props.onClick}
    >
      {props.category}
    </button>
  </li>
};

export default PostCategoryButton;