import { confirmAction } from "@utils/feedback";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import AppLayout from "@components/layout/AppLayout";
import "@styles/pages/appPages.css";

const projects = [
  ["ai-commit-analyzer", "private · Updated 2시간 전", "분석 완료", "1,248", "842", "28", true],
  ["backend-server", "private · Updated 5시간 전", "분석 완료", "562", "413", "16", false],
  ["frontend-app", "private · Updated 1일 전", "분석 중", "1,102", "724", "-", false],
  ["docs", "public · Updated 3일 전", "분석 대기", "-", "-", "-", false],
  ["utils-library", "private · Updated 1주 전", "분석 완료", "342", "219", "12", false],
];

const ProjectsPage = ({ currentPage, onNavigate }) => {
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
          <AnalysisStartDialog
            onStart={startAnalysis}
            trigger={<button type="button">GitHub 새 프로젝트 연결</button>}
          />
          <AnalysisStartDialog
            onStart={startAnalysis}
            trigger={<button type="button">＋ 새 분석 시작</button>}
          />
        </div>
      </header>

      <section className="project-page-grid">
        <div className="project-main">
          <div className="project-toolbar">
            <label><input placeholder="프로젝트를 검색하세요..." /></label>
            <select><option>전체 상태</option><option>분석 완료</option><option>분석 중</option></select>
            <select><option>최근 분석 순</option><option>이름순</option></select>
            <button type="button">▦</button>
            <button type="button">☷</button>
          </div>

          <div className="project-card-grid">
            {projects.map(([name, meta, status, commits, files, insights, starred]) => (
              <article className={starred ? "repo-card selected" : "repo-card"} key={name}>
                <div className="repo-head">
                  <span className="github-mark">GH</span>
                  <div>
                    <h2>{name}</h2>
                    <p>{meta}</p>
                  </div>
                  <button type="button" aria-label="더보기">⋮</button>
                </div>
                <div className="repo-state">
                  <span className={status === "분석 완료" ? "done" : "running"}>{status}</span>
                  <small>{status === "분석 중" ? "진행률 68%" : meta.split("Updated ")[1]}</small>
                </div>
                {status === "분석 중" ? <div className="mini-progress"><span /></div> : null}
                <div className="repo-stats">
                  <div><b>{commits}</b><small>커밋</small></div>
                  <div><b>{files}</b><small>파일 변경</small></div>
                  <div><b>{insights}</b><small>인사이트</small></div>
                </div>
                <div className="repo-actions">
                  <button type="button" onClick={() => onNavigate(status === "분석 중" ? "progress" : "result")}>
                    {status === "분석 중" ? "진행 중 보기" : "분석 결과 보기"} →
                  </button>
                  <button type="button" onClick={() => removeProject(name)}>♡</button>
                </div>
              </article>
            ))}

            <article className="repo-card new-card">
              <span>□＋</span>
              <h2>새 분석 시작하기</h2>
              <p>Git 산출물을 업로드하거나 GitHub 저장소를 선택해 AI 분석을 시작해보세요.</p>
              <AnalysisStartDialog
                onStart={startAnalysis}
                trigger={<button type="button">＋ 새 분석 시작</button>}
              />
            </article>
          </div>

          <div className="tip-card">
            <span>팁</span>
            <p>Git 산출물 업로드 분석은 GitHub 권한 연결 없이도 빠르게 코드 변경 흐름을 확인할 수 있어요.</p>
            <button type="button">업로드 가이드 보기 →</button>
          </div>
        </div>

        <aside className="project-help">
          <h2>분석을 시작해보세요</h2>
          <p>Git 명령어 산출물 또는 GitHub 연동 데이터로 개발 인사이트를 제공합니다.</p>
          <div className="help-visual" aria-hidden="true">⌘</div>
          {["자료 준비", "분석 방식 선택", "AI 분석 실행", "인사이트 확인"].map((step, index) => (
            <div className="help-step" key={step}>
              <span>{index + 1}</span>
              <div>
                <b>{step}</b>
                <p>{index === 0 ? "git log, git diff 산출물을 준비해요" : "분석 결과를 확인하고 개선해요"}</p>
              </div>
            </div>
          ))}
          <button type="button">사용 가이드 보기 →</button>
        </aside>
      </section>
    </AppLayout>
  );
};

export default ProjectsPage;
