import commitlensLogo from "@assets/images/commitlens-logo.png";
import "@styles/pages/landing.css";

const usageSteps = [
  ["GitHub 연결", "분석할 저장소나 변경 파일을 준비합니다."],
  ["분석 설정", "브랜치와 기간을 선택하고 필요한 옵션을 고릅니다."],
  ["AI 분석 실행", "변경 내용을 이해하기 쉬운 요약으로 정리합니다."],
  ["결과 활용", "검토할 내용과 추천 메시지를 작업에 반영합니다."],
];

const valueCards = [
  ["변경 흐름 정리", "흩어진 커밋과 파일 변경을 한눈에 이해할 수 있게 정리합니다."],
  ["검토 포인트 발견", "리뷰 전에 확인하면 좋은 변경 사항을 먼저 보여줍니다."],
  ["메시지 추천", "변경 내용에 맞는 커밋 메시지 후보를 제안합니다."],
];

const Dashboard = ({ onNavigate }) => {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <button className="landing-brand" type="button" onClick={() => onNavigate("dashboard")}>
          <img alt="CommitLens" src={commitlensLogo} />
        </button>
        <nav aria-label="서비스 메뉴">
          <a href="#features">기능</a>
          <a href="#how">사용 흐름</a>
          <a href="#value">장점</a>
        </nav>
        <div>
          <button className="ghost-link" type="button" onClick={() => onNavigate("auth")}>로그인</button>
          <button className="primary-action" type="button" onClick={() => onNavigate("signup")}>분석 시작하기</button>
        </div>
      </header>

      <section className="landing-hero" id="features">
        <div className="landing-copy">
          <span className="landing-kicker">AI Commit Analysis Workspace</span>
          <h1>
            커밋을 정리하고,
            <br />
            변경 내용을 이해하고,
            <br />
            <span>메시지 추천받으세요.</span>
          </h1>
          <p>
            CommitLens는 복잡한 커밋 기록과 코드 변경을 사용자가 이해하기 쉬운 분석 결과로 정리합니다.
            리뷰 전에 확인할 내용과 커밋 메시지 후보를 한곳에서 확인하세요.
          </p>
          <div className="landing-actions">
          </div>
        </div>
        <div className="landing-product-card" aria-hidden="true">
          <div className="product-card-top">
            <span />
            <span />
            <span />
            <b>CommitLens</b>
          </div>
          <div className="product-card-body">
            <div className="analysis-preview-main">
              <small>최근 분석</small>
              <strong>ai-commit-analyzer</strong>
              <p>인증 흐름 개선과 화면 구성 변경이 감지되었습니다.</p>
            </div>
            <div className="mini-diff-card">
              <span className="line green" />
              <span className="line green short" />
              <span className="line red" />
              <span className="line purple" />
            </div>
            <div className="message-suggestion-card">
              <small>추천 메시지</small>
              <code>feat(auth): 로그인 유지 흐름 개선</code>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-steps" id="how">
        <h2>사용 흐름</h2>
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

      <section className="landing-value" id="value">
        {valueCards.map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
