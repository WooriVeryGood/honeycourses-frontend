import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import AboutPage from "./components/AboutPage/AboutPage";
import CourseList from "./components/CourseList/CourseList";
import CourseReviews from "./components/CourseReviews/CourseReviews";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/view/:classID" element={<CourseReviews />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
