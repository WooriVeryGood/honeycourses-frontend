import React from "react";
import "./Paging.css";
import Pagination from "react-js-pagination";

interface PagingProps {
  page: number;
  count: number;
  setPage: (page: number) => void;
}

const Paging: React.FC<PagingProps> = ({ page, count, setPage }) => {
  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={10} // 페이지당 10개의 글
      totalItemsCount={count} // 총 글 갯수, API가 반환해줌
      pageRangeDisplayed={5}
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={setPage}
    />
  );
};

export default Paging;
