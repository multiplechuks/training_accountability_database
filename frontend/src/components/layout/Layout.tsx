import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Derive active menu item from current route
  const getActiveMenuItem = (pathname: string): string => {
    if (pathname.startsWith("/participants")) return "participant";
    if (pathname.startsWith("/training")) return "training";
    if (pathname.startsWith("/enrollment")) return "enrollment";
    if (pathname.startsWith("/allowances")) return "allowance";
    if (pathname.startsWith("/reports")) return "report";
    if (pathname.startsWith("/configuration")) return "configuration";
    return "dashboard";
  };

  const activeMenuItem = getActiveMenuItem(location.pathname);

  return (
    <div className="app-container">
      <Sidebar activeItem={activeMenuItem} />
      <main className="main-content">
        <div className="content-header">
          <h1 className="h4 mb-0 text-training-primary">Learning And Development</h1>
        </div>
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  );
}
