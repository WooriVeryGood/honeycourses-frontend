import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import AboutPage from "./components/AboutPage/AboutPage";
import CourseList from "./components/CourseList/CourseList";
import CourseReviews from "./components/CourseReviews/CourseReviews";
import AddReview from "./components/AddReview/AddReview";
import AddCourse from "./components/AddCourse/AddCourse";
import TermsConditions from "./components/TermsConditions/TermsConditions";
import Support from "./components/Support/Support";
import CommunityHome from "./components/CommunityHome/CommunityHome";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import { I18n } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-react';
import { RequireAuth } from "./RequireAuth";
import { Login } from "./components/Login/Login";
import CommunityPostView from "./components/CommunityPostView/CommunityPostView";
import AddPost from "./components/AddPost/AddPost";
I18n.putVocabularies(translations);
I18n.setLanguage('ko');
Amplify.configure(awsExports);

I18n.putVocabularies({
  ko: {
    'Enter your Password': '비밀번호 입력',
    'Please confirm your Password': '비밀번호 재입력',
    'Password must have lower case letters': '비밀번호는 소문자를 포함해야 합니다',
    'Password must have special characters': '비밀번호는 특수문자를 포함해야 합니다',
    'Password must have upper case letters': '비밀번호는 대문자를 포함해야 합니다',
    'Password must have at least 8 characters': '비밀번호는 8자 이상이어야 합니다',
    'Password must have numbers': '비밀번호는 숫자를 포함해야 합니다',
    'Your passwords must match': '비밀번호가 일치하지 않습니다',
    'An account with the given email already exists.': '이미 존재하는 이메일입니다',
    'Incorrect username or password.': '이메일 혹은 비밀번호가 일치하지 않습니다',
  },
  
});


export default function App() {


  return (
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<RequireAuth><CourseList /></RequireAuth>} />
            <Route path="/courses/view/:classID" element={<RequireAuth><CourseReviews /></RequireAuth>} />
            <Route path="/courses/addReview/:classID" element={<RequireAuth><AddReview /></RequireAuth>} />
            <Route path="/courses/addCourse" element={<RequireAuth><AddCourse /></RequireAuth>} />
            <Route path="/community" element={<RequireAuth><CommunityHome /></RequireAuth>} />
            <Route path="/community/view/:postID" element={<RequireAuth><CommunityPostView /></RequireAuth>} />
            <Route path="/community/addPost" element={<RequireAuth><AddPost /></RequireAuth>} />
            <Route path="/termsConditions" element={<TermsConditions />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </BrowserRouter>
  );
}

