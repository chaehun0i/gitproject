import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@stores/slices/authSlice";
import { logoutUser } from "../../api";
import { notify } from "@utils/feedback";
import "@styles/layout/sidebar.css";

const navGroups = [
  {
    label: "워크스페이스",
    items: [
      ["home", "홈", "H"],
      ["projects", "프로젝트", "P"],
      ["newAnalysis", "새 분석", "N"],
      ["history", "분석 내역", "L"],
    ],
  },
  {
    label: "분석 결과",
    items: [
      ["result", "결과 요약", "R"],
      ["detail", "상세 분석", "D"],
      ["commitMessage", "커밋 메시지", "C"],
    ],
  },
  {
    label: "계정",
    items: [["myPage", "설정", "S"]],
  },
];

const Sidebar = ({ currentPage, isCollapsed, onNavigate, onToggle }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const initials = user.name?.slice(0, 2).toUpperCase() ?? "CL";

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      dispatch(logoutAction());
      notify.info("로그아웃되었습니다.");
      onNavigate("dashboard");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <button className="brand" type="button" onClick={() => onNavigate("home")}>
          <span className="brand-mark">CL</span>
          <div>
            <strong>CommitLens</strong>
            <p>AI Git 분석 도구</p>
          </div>
        </button>
        <button
          className="sidebar-toggle"
          type="button"
          aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          onClick={onToggle}
        >
          {isCollapsed ? "›" : "‹"}
        </button>
      </div>

      <div className="sidebar-status">
        <span />
        <div>
          <b>개발 환경</b>
          <p>MariaDB 3307 · Redis</p>
        </div>
      </div>

      <nav className="side-nav" aria-label="주 메뉴">
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

      <div className="profile">
        <span>{initials}</span>
        <div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
        <button className="logout-button" type="button" onClick={handleLogout}>
          <i>Q</i>
          <span className="logout-text">로그아웃</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
