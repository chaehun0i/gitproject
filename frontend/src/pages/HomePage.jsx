import ActivityLineChart from "@components/charts/ActivityLineChart";
import { InsightVisual, ProductHeroVisual } from "@components/common/ProductVisuals";
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
  ["ai-commit-analyzer", "Git 산출물 업로드 · feature/FE_all", "분석 완료", "2시간 전", 92],
  ["backend-server", "GitHub 연동 · develop", "분석 완료", "5시간 전", 86],
  ["frontend-app", "GitHub 연동 · main", "분석 중", "1시간 전", 68],
  ["docs", "Git 산출물 업로드 · main", "대기 중", "3시간 전", 0],
];

const insights = [
  ["인증 흐름 개선", "토큰 갱신과 새로고침 복구 로직이 추가되어 로그인 유지 UX가 좋아졌습니다."],
  ["리팩토링 제안", "분석 결과 카드와 상태 배지를 공통 패턴으로 묶으면 유지보수가 쉬워집니다."],
  ["위험 변경 감지", "API 응답 스키마와 Redis 세션 TTL 변경은 통합 테스트 우선순위가 높습니다."],
];

const quickStart = [
  ["1", "GitHub 연결", "저장소를 연결하거나 Git 산출물을 업로드합니다."],
  ["2", "분석 옵션 선택", "요약, 위험 감지, 메시지 추천을 선택합니다."],
  ["3", "AI 분석 실행", "WebSocket 진행률로 파이프라인 상태를 확인합니다."],
  ["4", "결과 활용", "리뷰 포인트와 추천 메시지를 복사해 사용합니다."],
];

const HomePage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="AI 개발 분석 Workspace"
      description="커밋, diff, 파일 변경, AI 요약 결과를 한 곳에서 확인합니다."
    >
      <section className="workspace-hero">
        <div className="workspace-hero-copy">
          <span className="recommend-badge">CommitLens Workspace</span>
          <h2>커밋을 분석하고, 더 나은 개발을 만들어가세요</h2>
          <p>
            Git Parser와 Diff Parser가 수집한 변경 내용을 AI가 해석하고, DB 집계 결과를
            프로젝트별 인사이트와 추천 커밋 메시지로 보여줍니다.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => onNavigate("newAnalysis")}>새 분석 시작</button>
            <button type="button" onClick={() => onNavigate("projects")}>프로젝트 보기</button>
          </div>
        </div>
        <div className="workspace-hero-visual" aria-hidden="true">
          <img alt="" src={productVisual} />
          <div className="hero-mini-card">
            <b>AI 분석 진행</b>
            <span>변경 파일 42개 · 위험 포인트 8개</span>
          </div>
          <div className="hero-checklist">
            <span>커밋 수집 완료</span>
            <span>Diff Parser 완료</span>
            <span>AI 요약 생성 중</span>
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
          {recentProjects.map(([name, meta, status, time, progress]) => (
            <div className="home-project-row" key={name}>
              <span>GH</span>
              <div>
                <b>{name}</b>
                <small>{meta}</small>
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
            <InsightVisual />
          </div>
          <div>
            <h2>AI 인사이트 요약</h2>
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
