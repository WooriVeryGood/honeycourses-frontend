import { useState, useEffect, useRef } from "react";
import PageView from "../PageView/PageView";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../API/APIHandler";
import { CategoryKey, Post } from "../../types/post";

import Sidebar from "./components/Sidebar/CourseSideBar";
import PostContainer from "./components/PostContainer/PostContainer";
import { POST_CATEGORY_LABELS } from "../../constants/texts";

import styles from './CommunityHome.module.css';

export default function CommunityHome() {
  const savedPage = localStorage.getItem("lastPage");
  const savedCategory = localStorage.getItem("lastCategory");

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [noticePosts, setNoticePosts] = useState<Post[]>([]);
  const [currentCategory, setcurrentCategory] = useState<CategoryKey>((savedCategory === null) ? "All" : savedCategory as CategoryKey);
  const [currentPage, setCurrentPage] = useState<number>((savedPage === null) ? 1 : Number(savedPage));
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const isFirstMount = useRef(true);

  const navigate = useNavigate();

  const fetchDataFromApi = async (pageNo: number, category: string = "") => {
    try {
      setIsLoading(true);
      const categoryPath = category ? `/category/${category}` : "";
      const noticeResponse = await apiGet(`/community/category/notice`);
      const response = await apiGet(`/community${categoryPath}?page=${pageNo - 1}`);
      setNoticePosts(noticeResponse.data.posts);
      setPosts(response.data.posts);
      setTotalItemsCount(response.data.totalPostCount);
      setIsLoading(false);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  const handleSelectCategory = (category: CategoryKey) => {
    setCurrentPage(1);
    setcurrentCategory(category);
    fetchDataFromApi(1, POST_CATEGORY_LABELS[category]);
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false; 
  
      const savedPage = localStorage.getItem("lastPage");
      const savedCategory = localStorage.getItem("lastCategory");
      if (savedPage !== null && savedCategory !== null) {
        setCurrentPage(Number(savedPage));
        setcurrentCategory(savedCategory as CategoryKey);

        localStorage.removeItem("lastPage");
        localStorage.removeItem("lastCategory");

      }
    }
    if (!isFirstMount.current || (savedPage === null && savedCategory === null)) {
      fetchDataFromApi(currentPage, POST_CATEGORY_LABELS[currentCategory]);
    }
  }, [currentPage]);

  const linkToPostView = (postId: number) => {
    localStorage.setItem("lastPage", String(currentPage));
    localStorage.setItem("lastCategory", currentCategory);
    navigate(`/community/view/${postId}`);
  };

  return (
    <div>
      <PageView isLoading={isLoading}>
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
