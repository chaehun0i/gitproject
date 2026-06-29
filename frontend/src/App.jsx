import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { getCurrentUser } from "./api";
import { login, setAuthReady } from "@stores/slices/authSlice";
import Dashboard from "@pages/Dashboard";
import AuthPage from "@pages/AuthPage";
import SignupPage from "@pages/SignupPage";
import HomePage from "@pages/HomePage";
import ProjectsPage from "@pages/ProjectsPage";
import NewAnalysisPage from "@pages/NewAnalysisPage";
import AnalysisProgressPage from "@pages/AnalysisProgressPage";
import ResultSummaryPage from "@pages/ResultSummaryPage";
import DetailAnalysisPage from "@pages/DetailAnalysisPage";
import CommitMessagePage from "@pages/CommitMessagePage";
import HistoryPage from "@pages/HistoryPage";
import MyPage from "@pages/MyPage";

const publicRoutes = [
  { page: "dashboard", path: "/", element: Dashboard },
  { page: "auth", path: "/login", element: AuthPage },
  { page: "signup", path: "/signup", element: SignupPage },
];

const privateRoutes = [
  { page: "home", path: "/", element: HomePage },
  { page: "projects", path: "/projects", element: ProjectsPage },
  { page: "newAnalysis", path: "/analysis/new", element: NewAnalysisPage },
  { page: "progress", path: "/analysis/progress", element: AnalysisProgressPage },
  { page: "result", path: "/analysis/result", element: ResultSummaryPage },
  { page: "detail", path: "/analysis/detail", element: DetailAnalysisPage },
  { page: "commitMessage", path: "/analysis/commit-message", element: CommitMessagePage },
  { page: "history", path: "/history", element: HistoryPage },
  { page: "myPage", path: "/settings", element: MyPage },
];

const routeItems = [...publicRoutes, ...privateRoutes];

const pagePaths = routeItems.reduce((paths, route) => {
  return { ...paths, [route.page]: route.path };
}, { dashboard: "/", home: "/" });

const publicPathPages = publicRoutes.reduce((pages, route) => {
  return { ...pages, [route.path]: route.page };
}, {});

const privatePathPages = privateRoutes.reduce((pages, route) => {
  return { ...pages, [route.path]: route.page };
}, {});

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthReady, isLoggedIn } = useSelector((state) => state.auth);
  const pathPages = isLoggedIn ? privatePathPages : publicPathPages;
  const currentPage = pathPages[location.pathname] ?? (isLoggedIn ? "home" : "dashboard");

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await getCurrentUser();
        dispatch(login(user));
      } catch {
        dispatch(setAuthReady());
      }
    };

    restoreSession();
  }, [dispatch]);

  const handleNavigate = (page) => {
    navigate(pagePaths[page] ?? pagePaths.dashboard);
  };

  return (
    <>
      {isAuthReady ? <Routes>
        {publicRoutes.map(({ page, path, element: Page }) => (
          <Route
            element={
              isLoggedIn && page === "dashboard" ? (
                <HomePage currentPage="home" onNavigate={handleNavigate} />
              ) : isLoggedIn ? (
                <Navigate replace to="/" />
              ) : (
                <Page currentPage={currentPage} onNavigate={handleNavigate} />
              )
            }
            key={page}
            path={path}
          />
        ))}
        {privateRoutes.map(({ page, path, element: Page }) => (
          <Route
            element={
              isLoggedIn ? (
                <Page currentPage={currentPage} onNavigate={handleNavigate} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
            key={page}
            path={path}
          />
        ))}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes> : null}
      <Toaster richColors position="top-right" closeButton />
    </>
  );
};

export default App;
