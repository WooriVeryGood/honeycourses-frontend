import "./PageView.css";
import React from "react";

type PageViewProps = {
  children: React.ReactNode;
}

export default function PageView({ children }: PageViewProps) {
  return <div className="body">{children}</div>;
}
