const steps = [
  ["분석 방식 선택", "Git 산출물 업로드 또는 GitHub 연동 중 원하는 방식을 선택합니다."],
  ["분석 자료 입력", "git log, git diff, 변경 파일 목록 또는 GitHub 저장소 정보를 입력합니다."],
  ["인사이트 확인", "요약, 위험 변경 사항, 추천 커밋 메시지를 확인합니다."],
  ["결과 활용", "분석 결과를 팀과 공유하고 커밋 메시지 작성에 활용합니다."],
];

const GuidePanel = ({ onNavigate }) => {
  return (
    <article className="panel guide">
      <div className="panel-title">
        <h2>CommitLens 사용 방법</h2>
        <a href="#guide">자세히 보기 →</a>
      </div>
      {steps.map(([title, text], index) => (
        <div className="guide-step" key={title}>
          <span>{index + 1}</span>
          <div>
            <b>{title}</b>
            <p>{text}</p>
          </div>
        </div>
      ))}
      <button className="primary-action" type="button" onClick={() => onNavigate("newAnalysis")}>
        새 분석 시작하기 ＋
      </button>
    </article>
  );
};

export default GuidePanel;
