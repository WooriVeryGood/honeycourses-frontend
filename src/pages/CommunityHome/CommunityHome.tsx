import { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CategoryKey } from "../../types/post";

import Sidebar from "./components/Sidebar/CourseSideBar";
import PostContainer from "./components/PostContainer/PostContainer";

import styles from './CommunityHome.module.css';
import { usePosts } from "../../API/posts/usePosts";
import Loader from "../../components/Loader/Loader";

export default function CommunityHome() {
  const savedPage = localStorage.getItem("lastPage");
  const savedCategory = localStorage.getItem("lastCategory");
  const [currentCategory, setcurrentCategory] = useState<CategoryKey>((savedCategory === null) ? "All" : savedCategory as CategoryKey);
  const [currentPage, setCurrentPage] = useState<number>((savedPage === null) ? 1 : Number(savedPage));
  const navigate = useNavigate();

  const {isLoading, error, posts, noticePosts, totalItemsCount} = usePosts(currentPage, currentCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (!posts || !noticePosts || isLoading) {
    return <Loader />;
  }

  if(error) {
    alert('게시글 불러오기에 실패했습니다.');
  }

  const handleSelectCategory = (category: CategoryKey) => {
    setCurrentPage(1);
    setcurrentCategory(category);
  };

  const linkToPostView = (postId: number) => {
    localStorage.setItem("lastPage", String(currentPage));
    localStorage.setItem("lastCategory", currentCategory);
    navigate(`/community/view/${postId}`);
  };

  return (
    <div>
      <PageView>
        <Container
          fluid
          className={`justify-content-center align-items-start ${styles.pageViewContainer}`}
        >
          <div className={styles.communityContainer}>
            <Sidebar
              selectedCategory={currentCategory}
              onCategoryChange={handleSelectCategory}
            />

            <PostContainer
              currentPostCategory={currentCategory}
              posts={posts}
              noticePosts={noticePosts}
              linkToPostView={linkToPostView}
              currentPage={currentPage}
              totalPostsCount={totalItemsCount}
              setPage={setCurrentPage}
            />
          </div>
        </Container>
      </PageView>
    </div>
  );
}
