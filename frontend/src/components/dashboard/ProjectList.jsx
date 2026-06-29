const projects = [
  ["ai-commit-analyzer", "GitHub 연동 · main", "분석 완료", "2시간 전", "A"],
  ["backend-server", "GitHub 연동 · develop", "분석 완료", "5시간 전", "B"],
  ["frontend-app", "GitHub 연동 · main", "분석 중", "1시간 전", "F"],
  ["docs", "GitHub 연동 · main", "대기 중", "3시간 전", "D"],
  ["utils-library", "GitHub 연동 · feature/refactor", "분석 완료", "어제", "U"],
];

const ProjectList = ({ onNavigate }) => {
  return (
    <article className="panel recent">
      <div className="panel-title">
        <h2>최근 분석 프로젝트</h2>
        <a href="#all">전체 보기 →</a>
      </div>
      {projects.map(([name, meta, status, time, initial]) => (
        <div className="project-row" key={name}>
          <span className="repo-icon">{initial}</span>
          <div>
            <b>{name}</b>
            <p>{meta}</p>
          </div>
          <em className={status === "분석 완료" ? "done" : ""}>{status}</em>
          <small>{time}</small>
        </div>
      ))}
      <button className="outline-action" type="button" onClick={() => onNavigate("projects")}>
        프로젝트 목록 보기 →
      </button>
    </article>
  );
};

export default ProjectList;
