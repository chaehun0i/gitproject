import heroImage from "@assets/images/commitlens-hero.png";

const features = [
  ["Git 산출물 분석", "log, diff, patch를 AI가 해석"],
  ["변경 영향도 파악", "파일별 위험도와 리팩터링 포인트 확인"],
  ["커밋 메시지 추천", "상황에 맞는 메시지 초안 생성"],
];

const HeroPanel = () => {
  return (
    <article className="hero-panel">
      <div className="hero-copy">
        <span className="pill">AI Git 분석 플랫폼</span>
        <h2>커밋 히스토리와 코드 변경을 읽고 개발 인사이트로 바꿉니다</h2>
        <p>
          Git 명령어 산출물이나 GitHub 저장소 데이터를 분석해 변경 흐름, 위험 파일,
          리팩터링 포인트, 추천 커밋 메시지를 한 번에 정리합니다.
        </p>
        <div className="feature-row">
          {features.map(([title, text]) => (
            <div key={title}>
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <img alt="" src={heroImage} />
      </div>
    </article>
  );
};

export default HeroPanel;
