import heroImage from "@assets/images/commitlens-hero.png";
import "@styles/pages/landing.css";

const usageSteps = [
  ["1. 자료 준비", "GitHub를 연결하거나 git log, git diff 산출물을 준비합니다."],
  ["2. 분석 설정", "분석 방식과 범위를 선택하고 AI 분석을 시작합니다."],
  ["3. 결과 확인", "변경 요약, 위험 파일, 추천 메시지를 한 화면에서 확인합니다."],
  ["4. 메시지 활용", "AI가 제안한 커밋 메시지를 복사해 바로 사용합니다."],
];

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
          <a href="#pricing">요금제</a>
          <a href="#about">소개</a>
        </nav>
        <div>
          <button className="ghost-link" type="button" onClick={() => onNavigate("auth")}>로그인</button>
          <button className="primary-action" type="button" onClick={() => onNavigate("signup")}>시작하기</button>
        </div>
      </header>

      <section className="landing-hero" id="features">
        <div className="landing-copy">
          <h1>
            AI가 코드 변경을 분석하고
            <br />
            <span>더 나은 커밋</span>을 제안합니다
          </h1>
          <p>
            Git 산출물과 GitHub 변경 이력을 읽고 변경 요약, 위험 포인트, 커밋 메시지를
            포트폴리오 프로젝트에 맞는 흐름으로 보여줍니다.
          </p>
          <div className="landing-actions">
            <button type="button" onClick={() => onNavigate("signup")}>무료로 시작하기</button>
            <button type="button" onClick={() => onNavigate("auth")}>로그인하고 데모 보기</button>
          </div>
        </div>
        <div className="landing-visual" aria-hidden="true">
          <img alt="" src={heroImage} />
          <div className="landing-badge">AI 분석 완료</div>
        </div>
      </section>

      <section className="landing-steps" id="how">
        <h2>어떻게 사용하나요?</h2>
        <div>
          {usageSteps.map(([title, text]) => (
            <article key={title}>
              <span>&lt;/&gt;</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
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
