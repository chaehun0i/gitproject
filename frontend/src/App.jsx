import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { refreshSession } from "./api";
import { login, logout, setAuthReady } from "@stores/slices/authSlice";
import AppLayout from "@components/layout/AppLayout";
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
  { page: "home", path: "/", element: HomePage, title: "홈", description: "최근 작업과 분석 흐름을 확인하세요." },
  { page: "projects", path: "/projects", element: ProjectsPage, title: "프로젝트", description: "연결한 저장소와 분석 프로젝트를 관리하세요." },
  { page: "newAnalysis", path: "/analysis/new", element: NewAnalysisPage, title: "새 분석 시작", description: "저장소 연결 또는 파일 업로드 방식으로 변경 내용을 분석합니다." },
  { page: "progress", path: "/analysis/progress", element: AnalysisProgressPage, title: "분석 진행 상태", description: "분석 진행률과 현재 처리 단계를 확인합니다." },
  { page: "result", path: "/analysis/result", element: ResultSummaryPage, title: "분석 결과 요약", description: "이번 분석에서 확인된 변경 요약과 검토 항목을 한 화면에서 확인합니다." },
  { page: "detail", path: "/analysis/detail", element: DetailAnalysisPage, title: "파일 상세 분석", description: "파일별 변경 내용, AI 해석, 관련 커밋과 이슈를 함께 확인합니다." },
  { page: "commitMessage", path: "/analysis/commit-message", element: CommitMessagePage, title: "커밋 메시지 생성", description: "AI 분석 결과를 바탕으로 Conventional Commit 메시지를 추천합니다." },
  { page: "history", path: "/history", element: HistoryPage, title: "분석 내역", description: "과거 분석 결과를 다시 조회하는 화면입니다." },
  { page: "myPage", path: "/settings", element: MyPage, title: "마이페이지", description: "계정 정보와 서비스 설정을 관리하세요." },
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
        const user = await refreshSession();
        dispatch(login(user));
      } catch {
        dispatch(setAuthReady());
      }
    };

    restoreSession();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      return undefined;
    }

    const refresh = async () => {
      try {
        const user = await refreshSession();
        dispatch(login(user));
      } catch {
        dispatch(logout());
      }
    };

    const refreshTimer = window.setInterval(refresh, 10 * 60 * 1000);
    const refreshOnVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", refreshOnVisible);

    return () => {
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", refreshOnVisible);
    };
  }, [dispatch, isLoggedIn]);

  const handleNavigate = (page) => {
    navigate(pagePaths[page] ?? pagePaths.dashboard);
  };

  const renderPrivatePage = (Page, route) => (
    <AppLayout
      currentPage={currentPage}
      description={route.description}
      onNavigate={handleNavigate}
      title={route.title}
    >
      <Page currentPage={currentPage} onNavigate={handleNavigate} />
    </AppLayout>
  );

  return (
    <>
      {isAuthReady ? <Routes>
        {publicRoutes.map(({ page, path, element: Page }) => (
          <Route
            element={
              isLoggedIn && page === "dashboard" ? (
                renderPrivatePage(HomePage, privateRoutes[0])
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
        {privateRoutes.map((route) => {
          const { page, path, element: Page } = route;
          return (
          <Route
            element={
              isLoggedIn ? (
                renderPrivatePage(Page, route)
              ) : (
                <Navigate replace to="/login" />
              )
            }
            key={page}
            path={path}
          />
        );
        })}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes> : null}
      <Toaster richColors position="top-right" closeButton />
    </>
  );
};

export default App;
