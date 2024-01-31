import React, { useState, useEffect } from "react";
import PageView from "../PageView/PageView";
import { Badge, Button, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Community.module.css";
import Paging from "../Paging/Paging";
import { apiGet } from "../API/APIHandler";
import { Post } from "./types/post";
import { CategoryKey, CategoryMap } from "./types/postCategory";
import PostList from "./PostList";

import koreaTimeFormatter from "../../utils/koreaTimeFormatter";
import Sidebar from "./Sidebar";
import PostContainer from "./PostContainer";

export default function CommunityHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [noticePosts, setNoticePosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("All");
  const [layoutRightTitle, setTitle] = useState("All"); //오른쪽 layout 제목 설정
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const navigate = useNavigate();
  var firstLoad = true;

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
    setSelectedCategory(category);
    setTitle(category);
    fetchDataFromApi(1, CategoryMap[category]);
  };

  useEffect(() => {
    fetchDataFromApi(currentPage, CategoryMap[selectedCategory]);
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const tempPage = localStorage.getItem("currentPage");
    const tempCategory = localStorage.getItem("currentCategory");
    if (tempPage === null || tempCategory === null)
      return;
    const pageNum = tempPage === null ? 1 : Number(tempPage);
    const category = (tempCategory === null ? "All" : tempCategory) as CategoryKey;
    if (firstLoad) {
      firstLoad = false;
      setCurrentPage(pageNum);
      setSelectedCategory(category);
      return;
    }
    localStorage.removeItem("currentPage");
    localStorage.removeItem("currentCategory");
    setCurrentPage(pageNum);
    setSelectedCategory(category);
  }, []);

  const linkToPostView = (postId: number) => {
    localStorage.setItem("currentPage", String(currentPage));
    localStorage.setItem("currentCategory", selectedCategory);
    navigate(`/community/view/${postId}`);
  };

  // 카테고리별 게시글 분류
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.post_category === selectedCategory);

  return (
    <div>
      <PageView isLoading={isLoading}>
        <Container
          fluid
          className="justify-content-center align-items-start"
          style={{ justifyContent: "center", display: "flex" }}
        >
          <div className={styles.communityContainer}>
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleSelectCategory}
            />

            <PostContainer
              currentPostCategory={selectedCategory}
              posts={posts}
              noticePosts={noticePosts}
              linkToPostView={linkToPostView}
              currentPage={currentPage}
              totalPostsCount={totalItemsCount}
              setPage={handlePageChange}
            />
            {/* <div className={styles.comRight}>
              <div className={styles.rightHeader}>
                {layoutRightTitle}
                <Button
                  href="/community/addPost"
                  className="my-auto align-self-center"
                  variant="success"
                  size="sm"
                  style={{
                    marginLeft: "20px",
                    backgroundColor: "#43A680",
                    borderColor: "#43A680",
                  }}
                >
                  <img
                    src="/images/plus.svg"
                    className="bi"
                    width="23"
                    height="23"
                    alt="github-icon"
                  />
                  글 작성
                </Button>
              </div>
              <div className={styles.groupReviews}>
                <PostList
                  isNotNotice={false}
                  posts={noticePosts}
                  linkToPostView={linkToPostView}
                />
              </div>

              <div className={styles.groupReviews}>
                <PostList
                  isNotNotice={true}
                  posts={filteredPosts}
                  linkToPostView={linkToPostView}
                />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Paging
                    page={currentPage}
                    count={totalItemsCount}
                    setPage={handlePageChange}
                  />
                </div>
              </div>
            </div> */}
          </div>
        </Container>
      </PageView>
    </div>
  );
}
