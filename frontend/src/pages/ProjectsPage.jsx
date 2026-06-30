import { useMemo, useState } from "react";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import AppLayout from "@components/layout/AppLayout";
import { RepositoryEmptyVisual } from "@components/common/ProductVisuals";
import { confirmAction } from "@utils/feedback";
import { mockOrEmpty } from "@utils/mockConfig";
import "@styles/pages/appPages.css";

const mockProjects = [
  {
    id: "ai-commit-analyzer",
    name: "ai-commit-analyzer",
    owner: "chaehoon",
    repo: "ai-commit-analyzer",
    source: "Git 산출물",
    visibility: "private",
    branch: "feature/FE_all",
    language: "React",
    updated: "2시간 전",
    status: "분석 완료",
    commits: "1,248",
    files: "842",
    insights: "28",
    progress: 100,
    starred: true,
  },
  {
    id: "backend-server",
    name: "backend-server",
    owner: "chaehoon",
    repo: "backend-server",
    source: "GitHub",
    visibility: "private",
    branch: "develop",
    language: "FastAPI",
    updated: "5시간 전",
    status: "분석 완료",
    commits: "562",
    files: "413",
    insights: "16",
    progress: 100,
    starred: false,
  },
  {
    id: "frontend-app",
    name: "frontend-app",
    owner: "chaehoon",
    repo: "frontend-app",
    source: "GitHub",
    visibility: "private",
    branch: "main",
    language: "React",
    updated: "1일 전",
    status: "분석 중",
    commits: "1,102",
    files: "724",
    insights: "-",
    progress: 68,
    starred: false,
  },
  {
    id: "docs",
    name: "docs",
    owner: "chaehoon",
    repo: "docs",
    source: "Git 산출물",
    visibility: "public",
    branch: "main",
    language: "Markdown",
    updated: "3일 전",
    status: "분석 대기",
    commits: "-",
    files: "-",
    insights: "-",
    progress: 0,
    starred: false,
  },
  {
    id: "utils-library",
    name: "utils-library",
    owner: "chaehoon",
    repo: "utils-library",
    source: "GitHub",
    visibility: "private",
    branch: "feature/refactor",
    language: "Python",
    updated: "1주 전",
    status: "분석 완료",
    commits: "342",
    files: "219",
    insights: "12",
    progress: 100,
    starred: false,
  },
];

const statusClass = {
  "분석 완료": "done-label",
  "분석 중": "progress-label",
  "분석 대기": "wait-label",
};

const ProjectsPage = ({ currentPage, onNavigate }) => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("전체 상태");
  const [sort, setSort] = useState("최근 분석 순");
  const [viewMode, setViewMode] = useState("grid");
  const projects = mockOrEmpty(mockProjects);

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesKeyword = `${project.name} ${project.owner}/${project.repo}`.toLowerCase().includes(keyword.toLowerCase());
      const matchesStatus = status === "전체 상태" || project.status === status;
      return matchesKeyword && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "이름순") return a.name.localeCompare(b.name);
      if (sort === "즐겨찾기 우선") return Number(b.starred) - Number(a.starred);
      return 0;
    });
  }, [keyword, projects, sort, status]);

  const removeProject = (name) => {
    confirmAction({
      title: `${name} 프로젝트를 목록에서 제거할까요?`,
      text: "분석 결과는 보존하고 프로젝트 목록에서만 숨깁니다.",
      confirmButtonText: "제거",
    });
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={onNavigate}>
      <header className="project-header refined-header">
        <div>
          <span className="title-icon">R</span>
          <h1>내 프로젝트</h1>
          <p>연결된 저장소와 Git 산출물 분석 프로젝트를 한 곳에서 관리합니다.</p>
        </div>
        <div className="project-actions">
          <AnalysisStartDialog onStart={() => onNavigate("progress")} trigger={<button type="button">프로젝트 연결</button>} />
          <AnalysisStartDialog onStart={() => onNavigate("progress")} trigger={<button type="button">새 분석 시작</button>} />
        </div>
      </header>

      <section className="project-page-grid refined-project-grid">
        <div className="project-main">
          <div className="project-toolbar refined-toolbar">
            <label>
              <span>검색</span>
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="프로젝트명 또는 owner/repo" />
            </label>
            <label>
              <span>상태</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>전체 상태</option>
                <option>분석 완료</option>
                <option>분석 중</option>
                <option>분석 대기</option>
              </select>
            </label>
            <label>
              <span>정렬</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option>최근 분석 순</option>
                <option>이름순</option>
                <option>즐겨찾기 우선</option>
              </select>
            </label>
            <div className="segmented-view" aria-label="보기 방식">
              <button className={viewMode === "grid" ? "active" : ""} type="button" onClick={() => setViewMode("grid")}>▦</button>
              <button className={viewMode === "list" ? "active" : ""} type="button" onClick={() => setViewMode("list")}>☰</button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="project-empty-state">
              <RepositoryEmptyVisual />
              <h2>아직 연결된 프로젝트가 없습니다</h2>
              <p>GitHub 저장소를 연결하거나 Git 명령어 산출물을 업로드해 첫 분석을 시작하세요.</p>
              <AnalysisStartDialog onStart={() => onNavigate("progress")} trigger={<button type="button">새 분석 만들기</button>} />
            </div>
          ) : (
            <div className={viewMode === "list" ? "project-card-grid list-mode" : "project-card-grid"}>
              {filteredProjects.map((project) => (
                <article className={project.starred ? "repo-card selected refined-repo" : "repo-card refined-repo"} key={project.id}>
                  <div className="repo-head">
                    <span className="github-mark">{project.source === "GitHub" ? "GH" : "GIT"}</span>
                    <div>
                      <h2>{project.name}</h2>
                      <p>{project.owner}/{project.repo} · {project.visibility} · {project.branch}</p>
                    </div>
                    <button type="button" aria-label="더보기">⋯</button>
                  </div>

                  <div className="repo-meta-row">
                    <span>{project.source}</span>
                    <span>{project.language}</span>
                    <span>{project.updated}</span>
                  </div>

                  <div className="repo-state refined-state">
                    <span className={statusClass[project.status]}>{project.status}</span>
                    <small>{project.status === "분석 중" ? `진행률 ${project.progress}%` : project.updated}</small>
                  </div>
                  {project.status === "분석 중" ? <div className="mini-progress"><span style={{ "--score": `${project.progress}%` }} /></div> : null}

                  <div className="repo-stats">
                    <div><b>{project.commits}</b><small>커밋</small></div>
                    <div><b>{project.files}</b><small>파일 변경</small></div>
                    <div><b>{project.insights}</b><small>인사이트</small></div>
                  </div>

                  <div className="repo-actions">
                    <button type="button" onClick={() => onNavigate(project.status === "분석 중" ? "progress" : "result")}>
                      {project.status === "분석 중" ? "진행 보기" : "결과 보기"}
                    </button>
                    <button type="button" onClick={() => removeProject(project.name)}>제거</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="project-help refined-help">
          <RepositoryEmptyVisual />
          <h2>분석 시작 가이드</h2>
          <p>포트폴리오 데모에서도 실제 백엔드 파이프라인의 입력 방식을 이해할 수 있게 두 가지 분석 흐름을 분리했습니다.</p>
          {[
            ["1", "저장소 연결", "GitHub 저장소를 연결하거나 Git 산출물을 준비합니다."],
            ["2", "분석 설정", "브랜치, 커밋 범위, 분석 옵션을 선택합니다."],
            ["3", "AI 분석 실행", "변경 파일과 커밋 메시지 흐름을 분석합니다."],
            ["4", "인사이트 확인", "요약, 위험 포인트, 추천 메시지를 확인합니다."],
          ].map(([num, title, text]) => (
            <div className="help-step" key={title}>
              <span>{num}</span>
              <div>
                <b>{title}</b>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </AppLayout>
  );
};

export default ProjectsPage;
