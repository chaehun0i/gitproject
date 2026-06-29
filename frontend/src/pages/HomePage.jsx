import AppLayout from "@components/layout/AppLayout";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import "@styles/pages/appPages.css";

const insightCards = [
  ["분석한 프로젝트", "5", "전체 프로젝트"],
  ["총 커밋 수", "1,248", "최근 30일 기준"],
  ["분석 완료", "8", "총 분석 작업"],
  ["AI 성공률", "92%", "전체 성공률"],
];

const recentProjects = [
  ["ai-commit-analyzer", "Git 산출물 업로드 · main", "분석 완료", "2시간 전"],
  ["backend-server", "GitHub 연동 · develop", "분석 완료", "5시간 전"],
  ["frontend-app", "GitHub 연동 · main", "분석 중", "1시간 전"],
  ["docs", "Git 산출물 업로드 · main", "대기 중", "3시간 전"],
];

const HomePage = ({ currentPage, onNavigate }) => {
  const startAnalysis = () => {
    onNavigate("progress");
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={onNavigate}>
      <header className="home-hero">
        <div>
          <span>로그인됨</span>
          <h1>이채훈님, 오늘의 커밋 흐름을 확인해보세요.</h1>
          <p>Git 산출물 업로드와 GitHub 연동 분석을 한 화면에서 시작하고 추적합니다.</p>
        </div>
        <AnalysisStartDialog
          onStart={startAnalysis}
          trigger={<button type="button">＋ 새 분석 시작</button>}
        />
      </header>

      <section className="home-metrics">
        {insightCards.map(([label, value, hint]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>{hint}</small>
          </article>
        ))}
      </section>

      <section className="home-grid">
        <article className="page-card chart-card wide">
          <div className="panel-title">
            <h2>커밋 활동 트렌드</h2>
            <button type="button">전체 프로젝트</button>
          </div>
          <div className="line-chart" aria-label="커밋 활동 트렌드">
            {[20, 47, 60, 31, 44, 35, 58, 42, 56, 96, 72, 60, 38, 66, 49].map((height, index) => (
              <span style={{ "--height": `${height}%` }} key={index} />
            ))}
          </div>
        </article>

        <article className="page-card home-list-card">
          <div className="panel-title">
            <h2>최근 분석 프로젝트</h2>
            <button type="button" onClick={() => onNavigate("projects")}>전체 보기</button>
          </div>
          {recentProjects.map(([name, meta, status, time]) => (
            <div className="home-project-row" key={name}>
              <span>GH</span>
              <div>
                <b>{name}</b>
                <p>{meta}</p>
              </div>
              <em className={status === "분석 완료" ? "done-label" : "wait-label"}>{status}</em>
              <small>{time}</small>
            </div>
          ))}
        </article>

        <article className="page-card insight-card">
          <h2>AI 인사이트 요약</h2>
          <div className="summary-points">
            <span>지난 30일간 커밋 빈도가 12.4% 증가했습니다.</span>
            <span>중복 코드가 발견된 파일이 3개 있습니다.</span>
            <span>Conventional Commits 적용률은 68%입니다.</span>
          </div>
        </article>

        <article className="page-card risk-card">
          <h2>최근 활동</h2>
          {["프로젝트 분석 완료", "GitHub 연동 분석 시작", "새로운 커밋 28개 분석", "develop 브랜치 분석 완료"].map((item, index) => (
            <div className="risk-row" key={item}>
              <b>{index + 1}</b>
              <span>{item}</span>
              <em>{index === 0 ? "완료" : "진행"}</em>
            </div>
          ))}
        </article>
      </section>
    </AppLayout>
  );
};

export default HomePage;
