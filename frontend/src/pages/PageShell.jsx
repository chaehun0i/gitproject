import AppLayout from "@components/layout/AppLayout";
import "@styles/pages/appPages.css";

const PageShell = ({ currentPage, onNavigate, title, description, children }) => {
  return (
    <AppLayout currentPage={currentPage} onNavigate={onNavigate}>
      <header className="topbar">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>
      {children}
    </AppLayout>
  );
};

export default PageShell;
