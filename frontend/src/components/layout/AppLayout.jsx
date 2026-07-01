import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import Sidebar from "@components/layout/Sidebar";
import { logout as logoutAction } from "@stores/slices/authSlice";
import commitlensLogo from "@assets/images/commitlens-logo.png";
import { logoutUser } from "../../api";
import { notify } from "@utils/feedback";
import "@styles/layout/appLayout.css";

const initialNotifications = [
  { id: "analysis-done", title: "분석 완료", text: "ai-commit-analyzer 결과가 준비되었습니다.", time: "방금 전", type: "done" },
  { id: "review-needed", title: "검토 필요", text: "로그인 유지 변경에서 확인할 항목 2개가 있습니다.", time: "12분 전", type: "warn" },
  { id: "message-ready", title: "메시지 추천", text: "새 커밋 메시지 후보 4개가 생성되었습니다.", time: "1시간 전", type: "info" },
];

const notificationTabs = [
  ["all", "전체"],
  ["done", "분석"],
  ["warn", "검토"],
  ["info", "메시지"],
];

const AppLayout = ({ currentPage, onNavigate, title, description, children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("commitlens_sidebar") === "collapsed";
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const displayName = user?.name ?? "사용자";
  const email = user?.email ?? "user@example.com";
  const initials = displayName.slice(0, 2).toUpperCase();
  const filteredNotifications = notifications.filter(({ type }) => {
    return notificationTab === "all" || notificationTab === type;
  });

  useEffect(() => {
    localStorage.setItem(
      "commitlens_sidebar",
      isSidebarCollapsed ? "collapsed" : "expanded",
    );
  }, [isSidebarCollapsed]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      notify.info("로컬 데모 상태로 로그아웃합니다.");
    } finally {
      dispatch(logoutAction());
      notify.success("로그아웃되었습니다.");
      onNavigate("dashboard");
    }
  };

  return (
    <main className={isSidebarCollapsed ? "app-shell sidebar-collapsed" : "app-shell"}>
      <Sidebar
        currentPage={currentPage}
        isCollapsed={isSidebarCollapsed}
        onNavigate={onNavigate}
        onToggle={() => setIsSidebarCollapsed((value) => !value)}
      />
      {isSidebarCollapsed ? (
        <button
          className="sidebar-reopen"
          type="button"
          aria-label="사이드바 펼치기"
          onClick={() => setIsSidebarCollapsed(false)}
        >
          <img alt="CommitLens" src={commitlensLogo} />
          <span>›</span>
        </button>
      ) : null}
      <section className="dashboard">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="topbar-actions">
            <button className="topbar-secondary" type="button" onClick={() => onNavigate("projects")}>
              프로젝트
            </button>
            <AnalysisStartDialog
              trigger={<button className="topbar-primary" type="button">새 분석</button>}
              onStart={() => onNavigate("progress")}
            />
            <button
              className="topbar-notification"
              type="button"
              aria-label="알림 열기"
              onClick={() => setIsNotificationOpen(true)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M15.6 17.2H8.4a2 2 0 0 1-1.92-2.56l.38-1.32c.2-.7.3-1.42.3-2.15V9.7a4.84 4.84 0 0 1 9.68 0v1.47c0 .73.1 1.45.3 2.15l.38 1.32a2 2 0 0 1-1.92 2.56Z" />
                <path d="M9.9 19a2.25 2.25 0 0 0 4.2 0" />
                <path d="M12 4.2V3" />
              </svg>
              <span>알림</span>
              <b>{notifications.length}</b>
            </button>
            <button className="topbar-user" type="button" onClick={() => onNavigate("myPage")}>
              <span className="topbar-user-mark">{initials}</span>
              <span className="topbar-user-text">
                <b>{displayName}</b>
                <small>{email}</small>
              </span>
            </button>
            <button className="topbar-logout" type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </header>
        {children}
      </section>
      {isNotificationOpen ? (
        <>
          <button
            className="notification-backdrop"
            type="button"
            aria-label="알림 패널 닫기"
            onClick={() => setIsNotificationOpen(false)}
          />
          <aside className="notification-panel" aria-label="알림 패널">
            <div className="notification-head">
              <div>
                <h2>알림</h2>
                <p>분석 결과와 확인할 항목을 모아봅니다.</p>
              </div>
              <button type="button" onClick={() => setIsNotificationOpen(false)}>×</button>
            </div>
            <div className="notification-tabs" role="tablist" aria-label="알림 분류">
              {notificationTabs.map(([key, label]) => {
                const count = key === "all"
                  ? notifications.length
                  : notifications.filter(({ type }) => type === key).length;

                return (
                  <button
                    className={notificationTab === key ? "active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={notificationTab === key}
                    key={key}
                    onClick={() => setNotificationTab(key)}
                  >
                    {label}
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="notification-list">
              {filteredNotifications.length > 0 ? filteredNotifications.map(({ id, title: titleText, text, time, type }) => (
                <article className={`notification-item ${type}`} key={id}>
                  <span />
                  <div>
                    <b>{titleText}</b>
                    <p>{text}</p>
                    <small>{time}</small>
                  </div>
                  <button
                    className="notification-remove"
                    type="button"
                    aria-label={`${titleText} 알림 삭제`}
                    onClick={() => setNotifications((items) => items.filter((item) => item.id !== id))}
                  >
                    삭제
                  </button>
                </article>
              )) : (
                <div className="notification-empty">
                  <b>표시할 알림이 없습니다.</b>
                  <p>새 분석 결과나 확인할 항목이 생기면 이곳에 표시됩니다.</p>
                </div>
              )}
            </div>
            <button
              className="notification-footer"
              type="button"
              onClick={() => {
                setIsNotificationOpen(false);
                onNavigate("history");
              }}
            >
              분석 내역 보기
            </button>
          </aside>
        </>
      ) : null}
    </main>
  );
};

export default AppLayout;
