import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import AboutPage from "./components/AboutPage/AboutPage";
import CourseList from "./components/CourseList/CourseList";
import CourseReviews from "./components/CourseReviews/CourseReviews";
import AddReview from "./components/AddReview/AddReview";
import AddCourse from "./components/AddCourse/AddCourse";
import ReactGA from 'react-ga';

function App() {
  function GoogleAnalytics() {
    const location = useLocation();

    useEffect(() => {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID as string);
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    }, [location]);

    return null;
  }

  return (
    <BrowserRouter>
    <GoogleAnalytics />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/view/:classID" element={<CourseReviews />} />
        <Route path="/courses/addReview/:classID" element={<AddReview />} />
        <Route path="/courses/addCourse" element={<AddCourse />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
