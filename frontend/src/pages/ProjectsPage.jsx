import { useMemo, useState } from "react";
import { confirmAction } from "@utils/feedback";
import { mockOrEmpty } from "@utils/mockConfig";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import AppLayout from "@components/layout/AppLayout";
import "@styles/pages/appPages.css";

const mockProjects = [
  { name: "ai-commit-analyzer", meta: "private · Updated 2시간 전", status: "분석 완료", commits: "1,248", files: "842", insights: "28", starred: true },
  { name: "backend-server", meta: "private · Updated 5시간 전", status: "분석 완료", commits: "562", files: "413", insights: "16", starred: false },
  { name: "frontend-app", meta: "private · Updated 1일 전", status: "분석 중", commits: "1,102", files: "724", insights: "-", starred: false },
  { name: "docs", meta: "public · Updated 3일 전", status: "분석 대기", commits: "-", files: "-", insights: "-", starred: false },
  { name: "utils-library", meta: "private · Updated 1주 전", status: "분석 완료", commits: "342", files: "219", insights: "12", starred: false },
];

const ProjectsPage = ({ currentPage, onNavigate }) => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("전체 상태");
  const [sort, setSort] = useState("최근 분석 순");
  const [viewMode, setViewMode] = useState("grid");
  const projects = mockOrEmpty(mockProjects);

  const filteredProjects = useMemo(() => {
    const items = projects.filter((project) => {
      const matchesKeyword = project.name.toLowerCase().includes(keyword.toLowerCase());
      const matchesStatus = status === "전체 상태" || project.status === status;
      return matchesKeyword && matchesStatus;
    });

    return [...items].sort((a, b) => {
      if (sort === "이름순") return a.name.localeCompare(b.name);
      return Number(b.starred) - Number(a.starred);
    });
  }, [keyword, projects, sort, status]);

  const removeProject = (name) => {
    confirmAction({
      title: `${name} 프로젝트를 삭제할까요?`,
      text: "분석 내역은 보존되지만 프로젝트 목록에서 제거됩니다.",
      confirmButtonText: "삭제",
    });
  };

  const startAnalysis = () => {
    onNavigate("progress");
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={onNavigate}>
      <header className="project-header">
        <div>
          <span className="title-icon">□</span>
          <h1>내 프로젝트</h1>
          <p>Git 산출물 업로드 또는 GitHub 연동으로 분석을 시작하세요.</p>
        </div>
        <div className="project-actions">
          <AnalysisStartDialog onStart={startAnalysis} trigger={<button type="button">GitHub 새 프로젝트 연결</button>} />
          <AnalysisStartDialog onStart={startAnalysis} trigger={<button type="button">＋ 새 분석 시작</button>} />
        </div>
      </header>

      <section className="project-page-grid">
        <div className="project-main">
          <div className="project-toolbar">
            <label><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="프로젝트를 검색하세요..." /></label>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>전체 상태</option>
              <option>분석 완료</option>
              <option>분석 중</option>
              <option>분석 대기</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>최근 분석 순</option>
              <option>이름순</option>
            </select>
            <button className={viewMode === "grid" ? "active" : ""} type="button" onClick={() => setViewMode("grid")}>▦</button>
            <button className={viewMode === "list" ? "active" : ""} type="button" onClick={() => setViewMode("list")}>☷</button>
          </div>

          {filteredProjects.length ? (
            <div className={viewMode === "list" ? "project-card-grid list-mode" : "project-card-grid"}>
              {filteredProjects.map((project) => (
                <article className={project.starred ? "repo-card selected" : "repo-card"} key={project.name}>
                  <div className="repo-head">
                    <span className="github-mark">GH</span>
                    <div>
                      <h2>{project.name}</h2>
                      <p>{project.meta}</p>
                    </div>
                    <button type="button" aria-label="더보기">⋮</button>
                  </div>
                  <div className="repo-state">
                    <span className={project.status === "분석 완료" ? "done-label" : "wait-label"}>{project.status}</span>
                    <small>{project.status === "분석 중" ? "진행률 68%" : project.meta.split("Updated ")[1]}</small>
                  </div>
                  {project.status === "분석 중" ? <div className="mini-progress"><span /></div> : null}
                  <div className="repo-stats">
                    <div><b>{project.commits}</b><small>커밋</small></div>
                    <div><b>{project.files}</b><small>파일 변경</small></div>
                    <div><b>{project.insights}</b><small>인사이트</small></div>
                  </div>
                  <div className="repo-actions">
                    <button type="button" onClick={() => onNavigate(project.status === "분석 중" ? "progress" : "result")}>
                      {project.status === "분석 중" ? "진행 중 보기" : "분석 결과 보기"} →
                    </button>
                    <button type="button" onClick={() => removeProject(project.name)}>삭제</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <article className="page-card empty-state">표시할 프로젝트가 없습니다. 새 분석을 시작해보세요.</article>
          )}
        </div>

        <aside className="project-help">
          <h2>분석을 시작해보세요</h2>
          <p>Git 명령어 산출물 또는 GitHub 연동 데이터로 개발 인사이트를 제공합니다.</p>
          {["자료 준비", "분석 방식 선택", "AI 분석 실행", "인사이트 확인"].map((step, index) => (
            <div className="help-step" key={step}>
              <span>{index + 1}</span>
              <div>
                <b>{step}</b>
                <p>{index === 0 ? "git log, git diff 산출물을 준비해요" : "분석 결과를 확인하고 개선해요"}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </AppLayout>
  );
};

export default ProjectsPage;
