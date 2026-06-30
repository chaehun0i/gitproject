import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@stores/slices/authSlice";
import { logoutUser } from "../../api";
import { notify } from "@utils/feedback";
import "@styles/layout/sidebar.css";

const navGroups = [
  {
    label: "Workspace",
    items: [
      ["home", "홈", "⌘"],
      ["projects", "프로젝트", "R"],
      ["newAnalysis", "새 분석", "+"],
      ["history", "분석 내역", "H"],
    ],
  },
  {
    label: "Analysis",
    items: [
      ["result", "결과 요약", "S"],
      ["detail", "파일 상세", "D"],
      ["commitMessage", "커밋 메시지", "M"],
    ],
  },
  {
    label: "Account",
    items: [["myPage", "설정", "G"]],
  },
];

const Sidebar = ({ currentPage, isCollapsed, onNavigate, onToggle }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const initials = user.name?.slice(0, 2).toUpperCase() ?? "CL";

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
    <aside className="sidebar">
      <div className="sidebar-head">
        <button className="brand" type="button" onClick={() => onNavigate("home")} title="CommitLens 홈">
          <span className="brand-mark">&lt;/&gt;</span>
          <div>
            <strong>CommitLens</strong>
            <p>AI Git 분석 워크스페이스</p>
          </div>
        </button>
        <button
          className="sidebar-toggle"
          type="button"
          aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          onClick={onToggle}
          title={isCollapsed ? "펼치기" : "접기"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="sidebar-status">
        <span />
        <div>
          <b>Local Runtime</b>
          <p>MariaDB 3307 · Redis · API /api</p>
        </div>
      </div>

      <nav className="side-nav" aria-label="주요 메뉴">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <span>{group.label}</span>
            {group.items.map(([page, label, icon]) => (
              <button
                className={currentPage === page ? "active" : ""}
                type="button"
                key={page}
                onClick={() => onNavigate(page)}
                title={label}
              >
                <i>{icon}</i>
                <b>{label}</b>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-pipeline" aria-hidden="true">
        <span>Git</span>
        <i />
        <span>AI</span>
        <i />
        <span>DB</span>
      </div>

      <div className="profile">
        <span>{initials}</span>
        <div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
        <button className="logout-button" type="button" onClick={handleLogout}>
          <i>⏻</i>
          <span className="logout-text">로그아웃</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
