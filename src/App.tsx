import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import CourseList from "./pages/CourseList/CourseList";
import CourseReviews from "./pages/CourseReviews/CourseReviews";
import AddReview from "./pages/AddReview/AddReview";
import AddCourse from "./pages/AddCourse/AddCourse";
import TermsConditions from "./pages/TermsConditions/TermsConditions";
import Support from "./pages/Support/Support";
import CommunityHome from "./pages/CommunityHome/CommunityHome";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import { I18n } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-react';
import { RequireAuth } from "./utils/RequireAuth";
import { Login } from "./pages/Login/Login";
import CommunityPostView from "./pages/CommunityPostView/CommunityPostView";
import AddPost from "./pages/AddPost/AddPost";
import MyInfo from "./pages/MyInfo/MyInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
    'Current Password': '현재 비밀번호',
    'New Password': '새 비밀번호',
    'Update password': '비밀번호 변경',
  },
});

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/myinfo" element={<RequireAuth><MyInfo /></RequireAuth>} />
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
      </QueryClientProvider>
  );
}

