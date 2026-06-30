import { ProductHeroVisual } from "@components/common/ProductVisuals";
import "@styles/pages/landing.css";

const usageSteps = [
  ["GitHub 연결", "저장소를 연결하거나 Git 명령어 산출물을 업로드합니다."],
  ["분석 설정", "브랜치, 커밋 범위, 분석 옵션을 선택합니다."],
  ["AI 분석 실행", "Git Parser, Diff Parser, AI 요약 파이프라인을 실행합니다."],
  ["결과 활용", "리뷰 포인트와 추천 커밋 메시지를 팀 작업에 반영합니다."],
];

const integrations = ["GitHub", "GitLab", "Docker", "AWS", "Redis", "MariaDB"];

const stats = [
  ["98%+", "변경 흐름 이해"],
  ["70%", "메시지 작성 시간 절약"],
  ["2.5x", "리뷰 공유 속도 개선"],
  ["1,248+", "분석 가능한 커밋"],
];

const Dashboard = ({ onNavigate }) => {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <button className="landing-brand" type="button" onClick={() => onNavigate("dashboard")}>
          <span>&lt;/&gt;</span>
          <strong>CommitLens</strong>
        </button>
        <nav aria-label="서비스 메뉴">
          <a href="#features">기능</a>
          <a href="#how">사용 방법</a>
          <a href="#pipeline">파이프라인</a>
          <a href="#about">소개</a>
        </nav>
        <div>
          <button className="ghost-link" type="button" onClick={() => onNavigate("auth")}>로그인</button>
          <button className="primary-action" type="button" onClick={() => onNavigate("signup")}>시작하기</button>
        </div>
      </header>

      <section className="landing-hero" id="features">
        <div className="landing-copy">
          <span className="landing-kicker">AI Commit Analysis Workspace</span>
          <h1>
            AI가 커밋과 코드 변경을 분석해
            <br />
            <span>개발 인사이트</span>를 제공합니다
          </h1>
          <p>
            GitHub 연동과 Git 명령어 산출물 업로드를 모두 지원합니다. 커밋 흐름, 코드 diff,
            위험 변경, 추천 커밋 메시지를 하나의 포트폴리오형 SaaS 화면에서 확인할 수 있습니다.
          </p>
          <div className="landing-actions">
            <button type="button" onClick={() => onNavigate("signup")}>무료로 시작하기</button>
            <button type="button" onClick={() => onNavigate("auth")}>로그인하고 데모 보기</button>
          </div>
          <div className="integration-strip" aria-label="개발 도구 연동">
            {integrations.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <div className="landing-visual" aria-hidden="true">
          <ProductHeroVisual />
          <div className="landing-badge">AI 분석 완료</div>
        </div>
      </section>

      <section className="landing-steps" id="how">
        <h2>어떻게 사용하나요?</h2>
        <div>
          {usageSteps.map(([title, text], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-pipeline" id="pipeline">
        <div>
          <span className="landing-kicker">Backend Pipeline</span>
          <h2>Parser, AI 분석, DB 집계가 화면에 드러나는 구조</h2>
          <p>
            Git 로그와 diff를 수집하고, 변경 파일을 파싱한 뒤 AI 분석 결과를 DB에 저장하는 흐름을
            사용자가 이해할 수 있도록 모든 주요 화면에 진행 상태와 집계 데이터를 배치했습니다.
          </p>
        </div>
        <div className="pipeline-cards">
          {["Git Parser", "Diff Parser", "AI Summary", "MariaDB", "Redis Session"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="landing-stats">
        {stats.map(([value, label]) => (
          <article key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
