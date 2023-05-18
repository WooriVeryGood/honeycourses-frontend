import "./PageView.css";
import React from "react";
import { useEffect } from "react";
import { Spinner, Container } from "react-bootstrap";
import Placeholder from 'react-bootstrap/Placeholder';


type PageViewProps = {
  children: React.ReactNode;
  paddingBottom?: number;
  isLoading?: boolean;
}

export default function PageView({ children, paddingBottom = 0, isLoading = false }: PageViewProps) {
  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, []);
  
  const style = {
    minHeight: `calc(100vh - 70px)`,
    display: 'flex',
    marginTop: '90px',
    paddingBottom: paddingBottom,
  };
  
  return (
    <div className="body" style={style}>
      {isLoading ? ( // Display loading spinner if isLoading is true
      <Container
      fluid
      className="d-flex justify-content-center"
    >
      <Spinner className="my-auto" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
        </Spinner>
        
      </Container>
      
      ) : (
        children // Render children if isLoading is false
      )}
    </div>
  );
}
