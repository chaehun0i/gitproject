import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@stores/slices/authSlice";
import { logoutUser } from "../../api";
import { notify } from "@utils/feedback";
import "@styles/layout/sidebar.css";

const navGroups = [
  {
    label: "",
    items: [["home", "홈", "⌂"]],
  },
  {
    label: "분석",
    items: [
      ["projects", "프로젝트 목록", "□"],
      ["newAnalysis", "새 분석 시작", "+"],
      ["history", "분석 내역", "◷"],
    ],
  },
  {
    label: "데이터",
    items: [
      ["result", "결과 요약", "▣"],
      ["detail", "상세 분석", "◇"],
      ["commitMessage", "커밋 메시지", "✎"],
    ],
  },
  {
    label: "설정",
    items: [
      ["myPage", "마이페이지", "⚙"],
    ],
  },
];

const Sidebar = ({ currentPage, isCollapsed, onNavigate, onToggle }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const initials = user.name?.slice(0, 2).toUpperCase() ?? "CL";

  const logout = async () => {
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
          <span className="brand-mark">&lt;/&gt;</span>
          <div>
            <strong>CommitLens</strong>
            <p>AI Git 분석 포트폴리오</p>
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
          <b>세션 연결됨</b>
          <p>Redis + JWE 쿠키</p>
        </div>
      </div>

      <nav className="side-nav" aria-label="주 메뉴">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label || "home"}>
            {group.label ? <span>{group.label}</span> : null}
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
        <button className="logout-button" type="button" aria-label="로그아웃" onClick={logout}>
          ⎋ <span className="logout-text">로그아웃</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
