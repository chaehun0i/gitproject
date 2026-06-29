import { useEffect, useState } from "react";
import Sidebar from "@components/layout/Sidebar";
import "@styles/layout/appLayout.css";

const AppLayout = ({ currentPage, onNavigate, children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("commitlens_sidebar") === "collapsed";
  });

  useEffect(() => {
    localStorage.setItem(
      "commitlens_sidebar",
      isSidebarCollapsed ? "collapsed" : "expanded",
    );
  }, [isSidebarCollapsed]);

  return (
    <main className={isSidebarCollapsed ? "app-shell sidebar-collapsed" : "app-shell"}>
      <Sidebar
        currentPage={currentPage}
        isCollapsed={isSidebarCollapsed}
        onNavigate={onNavigate}
        onToggle={() => setIsSidebarCollapsed((value) => !value)}
      />
      <section className="dashboard">{children}</section>
    </main>
  );
};

export default AppLayout;
