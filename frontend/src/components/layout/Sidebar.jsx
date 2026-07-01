import commitlensLogo from "@assets/images/commitlens-logo.png";
import "@styles/layout/sidebar.css";

const navGroups = [
  {
    label: "작업 공간",
    items: [
      ["home", "홈", "H"],
      ["projects", "프로젝트", "R"],
      ["history", "분석 내역", "L"],
    ],
  },
  {
    label: "분석 결과",
    items: [
      ["result", "결과 요약", "S"],
      ["detail", "파일 상세", "D"],
      ["commitMessage", "커밋 메시지", "M"],
    ],
  },
  {
    label: "계정",
    items: [["myPage", "마이페이지", "G"]],
  },
];

const Sidebar = ({ currentPage, isCollapsed, onNavigate, onToggle }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <button className="brand" type="button" onClick={() => onNavigate("home")} title="CommitLens 홈">
          <img className="brand-logo-image" alt="CommitLens" src={commitlensLogo} />
        </button>
        <button
          className="sidebar-toggle"
          type="button"
          aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          onClick={onToggle}
          title={isCollapsed ? "펼치기" : "접기"}
        >
          {isCollapsed ? "›" : "‹"}
        </button>
      </div>

      <div className="sidebar-status">
        <span />
        <div>
          <b>작업 준비 완료</b>
          <p>상단의 새 분석 버튼으로 시작하세요</p>
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

      <aside className="sidebar-summary">
        <span>최근 분석</span>
        <strong>ai-commit-analyzer</strong>
        <p>검토할 변경 8개가 정리되었습니다.</p>
        <button type="button" onClick={() => onNavigate("result")}>결과 보기</button>
      </aside>

    </aside>
  );

};

export default Sidebar;
