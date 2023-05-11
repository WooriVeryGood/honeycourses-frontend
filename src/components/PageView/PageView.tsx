import "./PageView.css";
import React from "react";


type PageViewProps = {
  children: React.ReactNode;
  paddingBottom?: number;
}

export default function PageView({ children, paddingBottom = 0 }: PageViewProps) {
  const style = {
    minHeight: `calc(100vh - 70px)`,
    display: 'flex',
    marginTop: '90px',
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlign:'center' as CSSProperties['textAlign'],
    paddingBottom: paddingBottom,
  };
  return <div className="body" style={style}>{children}</div>;
}
