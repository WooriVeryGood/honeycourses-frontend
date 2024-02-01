import "./PageView.css";
import React from "react";
import { useEffect } from "react";
import { Spinner, Container } from "react-bootstrap";

type PageViewProps = {
  children: React.ReactNode;
  paddingBottom?: number;
  isLoading?: boolean;
};

export default function PageView({
  children,
  paddingBottom = 0,
  isLoading = false,
}: PageViewProps) {
  useEffect(() => {
    // 맨 위로 페이지 스크롤 올리기
    window.scrollTo(0, 0);
  }, []);

  const style = {
    minHeight: `calc(100vh - 70px)`,
    display: "flex",
    marginTop: "90px",
    paddingBottom: paddingBottom,
  };

  return (
    <div className="body" style={style}>
      {isLoading ? ( // isLoading일 시 로딩 아이콘 표시
        <Container fluid className="d-flex justify-content-center">
          <Spinner className="my-auto" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : (
        children // isLoading 아닐 시 children 렌더
      )}
    </div>
  );
}
