import { useState } from "react";
import ActivityLineChart from "@components/charts/ActivityLineChart";
import AppLayout from "@components/layout/AppLayout";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import { mockOrEmpty, useMocks } from "@utils/mockConfig";
import "@styles/pages/appPages.css";

const mockMetrics = [
  ["분석한 프로젝트", "5", "전체 프로젝트"],
  ["총 커밋 수", "1,248", "최근 30일 기준"],
  ["분석 완료", "8", "총 분석 작업"],
  ["AI 성공률", "92%", "전체 성공률"],
];

const mockProjects = [
  ["ai-commit-analyzer", "Git 산출물 업로드 · main", "분석 완료", "2시간 전"],
  ["backend-server", "GitHub 연동 · develop", "분석 완료", "5시간 전"],
  ["frontend-app", "GitHub 연동 · main", "분석 중", "1시간 전"],
  ["docs", "Git 산출물 업로드 · main", "대기 중", "3시간 전"],
];

const chartSets = {
  all: [20, 47, 60, 31, 44, 35, 58, 42, 56, 96, 72, 60, 38, 66, 49],
  upload: [18, 28, 42, 30, 48, 33, 40, 58, 46, 70, 62, 52, 44, 50, 64],
  github: [12, 35, 44, 25, 38, 45, 65, 52, 64, 88, 78, 68, 48, 76, 58],
};

const HomePage = ({ currentPage, onNavigate }) => {
  const [chartMode, setChartMode] = useState("all");
  const metrics = mockOrEmpty(mockMetrics);
  const recentProjects = mockOrEmpty(mockProjects);

  const startAnalysis = () => {
    onNavigate("progress");
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={onNavigate}>
      <header className="home-hero">
        <div>
          <span>{useMocks ? "더미 데이터 사용 중" : "실데이터 모드"}</span>
          <h1>이채훈님, 오늘의 커밋 흐름을 확인해보세요.</h1>
          <p>Git 산출물 업로드와 GitHub 연동 분석을 한 화면에서 시작하고 추적합니다.</p>
        </div>
        <AnalysisStartDialog
          onStart={startAnalysis}
          trigger={<button type="button">＋ 새 분석 시작</button>}
        />
      </header>

      <section className="home-metrics">
        {metrics.length ? metrics.map(([label, value, hint]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>{hint}</small>
          </article>
        )) : <article className="page-card empty-state">연결된 분석 데이터가 없습니다.</article>}
      </section>

      <section className="home-grid">
        <article className="page-card chart-card wide">
          <div className="panel-title">
            <h2>커밋 활동 트렌드</h2>
            <select value={chartMode} onChange={(event) => setChartMode(event.target.value)}>
              <option value="all">전체 프로젝트</option>
              <option value="upload">Git 산출물</option>
              <option value="github">GitHub 연동</option>
            </select>
          </div>
          <ActivityLineChart values={chartSets[chartMode]} />
        </article>

        <article className="page-card home-list-card">
          <div className="panel-title">
            <h2>최근 분석 프로젝트</h2>
            <button type="button" onClick={() => onNavigate("projects")}>전체 보기</button>
          </div>
          {recentProjects.length ? recentProjects.map(([name, meta, status, time]) => (
            <div className="home-project-row" key={name}>
              <span>GH</span>
              <div>
                <b>{name}</b>
                <p>{meta}</p>
              </div>
              <em className={status === "분석 완료" ? "done-label" : "wait-label"}>{status}</em>
              <small>{time}</small>
            </div>
          )) : <p className="empty-text">최근 분석 프로젝트가 없습니다.</p>}
        </article>

        <article className="page-card insight-card">
          <h2>AI 인사이트 요약</h2>
          <div className="summary-points">
            {(useMocks ? [
              "지난 30일간 커밋 빈도가 12.4% 증가했습니다.",
              "중복 코드가 발견된 파일이 3개 있습니다.",
              "Conventional Commits 적용률은 68%입니다.",
            ] : ["분석이 완료되면 AI 요약이 표시됩니다."]).map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>

        <article className="page-card risk-card">
          <h2>최근 활동</h2>
          {(useMocks ? ["프로젝트 분석 완료", "GitHub 연동 분석 시작", "새로운 커밋 28개 분석", "develop 브랜치 분석 완료"] : ["활동 내역이 없습니다."]).map((item, index) => (
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
