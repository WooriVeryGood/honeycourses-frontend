import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Header from "./components/Header";
import PageView from "./components/PageView/PageView";

function App() {
  return (
    <div>
      <Header />
      <PageView />
    </div>
  );
}

export default App;
