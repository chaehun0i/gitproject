import ActivityLineChart from "@components/charts/ActivityLineChart";
import PageShell from "@pages/PageShell";
import productVisual from "@assets/images/commitlens-product-visual.png";

const kpis = [
  ["총 프로젝트", "5", "GitHub 3 · 업로드 2"],
  ["총 분석 수", "42", "이번 주 8건"],
  ["분석 커밋", "1,248", "지난 30일 기준"],
  ["절약된 시간", "70h", "리뷰/메시지 작성"],
  ["AI 제안 수락률", "92%", "팀 적용 기준"],
];

const recentProjects = [
  ["ai-commit-analyzer", "파일 업로드", "feature/FE_all", "분석 완료", "2시간 전", 92],
  ["backend-server", "저장소 연결", "develop", "분석 완료", "5시간 전", 86],
  ["frontend-app", "저장소 연결", "main", "분석 중", "1시간 전", 68],
  ["docs", "파일 업로드", "main", "대기 중", "3시간 전", 0],
];

const insights = [
  ["검토할 변경", "로그인 유지와 화면 구성 변경은 먼저 확인하면 좋습니다."],
  ["정리된 변경", "최근 작업은 인증 화면과 분석 화면 개선에 집중되어 있습니다."],
  ["추천 메시지", "변경 흐름에 맞는 커밋 메시지 후보가 준비되었습니다."],
];

const quickStart = [
  ["1", "프로젝트 선택", "저장소를 연결하거나 변경 파일을 업로드합니다."],
  ["2", "분석 옵션 선택", "요약, 위험 감지, 메시지 추천을 선택합니다."],
  ["3", "분석 실행", "진행 상태를 확인하며 결과를 기다립니다."],
  ["4", "결과 활용", "검토할 변경과 추천 메시지를 확인합니다."],
];

const HomePage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="작업 공간"
      description="최근 분석과 검토할 변경 사항을 한 곳에서 확인합니다."
    >
      <section className="workspace-hero">
        <div className="workspace-hero-copy">
          <span className="recommend-badge">최근 작업</span>
          <h2>커밋을 분석하고, 더 나은 개발을 만들어가세요</h2>
          <p>
            최근 변경 내용을 정리하고, 검토할 항목과 추천 커밋 메시지를 빠르게 확인하세요.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => onNavigate("newAnalysis")}>새 분석 시작</button>
            <button type="button" onClick={() => onNavigate("projects")}>프로젝트 보기</button>
          </div>
        </div>
        <div className="workspace-hero-visual" aria-hidden="true">
          <img alt="" src={productVisual} />
          <div className="hero-mini-card">
            <b>최근 분석</b>
            <span>변경 파일 42개 · 검토 항목 8개</span>
          </div>
          <div className="hero-checklist">
            <span>변경 내용 확인</span>
            <span>요약 준비</span>
            <span>메시지 추천 중</span>
          </div>
        </div>
      </section>

      <section className="home-metrics workspace-metrics">
        {kpis.map(([label, value, hint]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>{hint}</small>
          </article>
        ))}
      </section>

      <section className="home-grid">
        <article className="page-card home-list-card">
          <div className="panel-title">
            <h2>최근 분석 프로젝트</h2>
            <button type="button" onClick={() => onNavigate("projects")}>전체 보기</button>
          </div>
          {recentProjects.map(([name, source, branch, status, time, progress]) => (
            <div className="home-project-row" key={name}>
              <span>{source === "저장소 연결" ? "Repo" : "Git"}</span>
              <div>
                <b>{name}</b>
                <small>{source} · {branch} · {time}</small>
              </div>
              <em className={status === "분석 완료" ? "done-label" : "wait-label"}>{status}</em>
              <div>
                <small>{time}</small>
                {progress > 0 ? <div className="mini-progress"><span style={{ "--score": `${progress}%` }} /></div> : null}
              </div>
            </div>
          ))}
        </article>

        <article className="page-card chart-card">
          <div className="panel-title">
            <h2>커밋 활동 추세</h2>
            <span className="recommend-badge">30일</span>
          </div>
          <ActivityLineChart values={[28, 42, 36, 58, 49, 72, 64, 88, 73, 95, 69, 82]} />
        </article>
      </section>

      <section className="workspace-bottom-grid">
        <article className="page-card ai-insight-workspace">
          <div>
            <h2>검토할 변경 요약</h2>
            <div className="summary-points">
              {insights.map(([title, text]) => (
                <span key={title}><b>{title}</b>{text}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="page-card quick-start-card">
          <h2>Quick Start</h2>
          {quickStart.map(([step, title, text]) => (
            <div className="help-step" key={step}>
              <span>{step}</span>
              <div>
                <b>{title}</b>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </article>
      </section>
    </PageShell>
  );
};

export default HomePage;
