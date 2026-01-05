"use client";
import React, { ReactNode } from "react";
import "../styles/globals.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-wrapper">
      {children}
    </div>
  );
};

export default Layout;
