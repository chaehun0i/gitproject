import { notify } from "@utils/feedback";
import PageShell from "@pages/PageShell";

const steps = [
  ["커밋 수집 중", "Git 산출물과 커밋 메타데이터를 가져오는 중입니다.", "완료"],
  ["변경 파일 분석 중", "변경된 파일들을 분류하고 있습니다.", "완료"],
  ["코드 변경 이해 중", "AI가 코드 변경 의미를 이해하는 중입니다.", "진행 중"],
  ["AI 요약 생성 중", "변경 내용을 요약하고 주요 포인트를 추출하는 중입니다.", "대기"],
  ["커밋 메시지 제안 중", "최적의 커밋 메시지를 생성하는 중입니다.", "대기"],
];

const AnalysisProgressPage = ({ currentPage, onNavigate }) => {
  const completeAnalysis = () => {
    notify.success("분석이 완료되었습니다.");
    onNavigate("result");
  };

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="분석 진행 중"
      description="AI가 커밋 히스토리를 분석하고 있습니다. 잠시만 기다려주세요."
    >
      <section className="progress-layout">
        <article className="page-card progress-card">
          <div className="progress-head">
            <div>
              <span>전체 진행률</span>
              <strong>65%</strong>
            </div>
            <small>남은 예상 시간: 1분 20초</small>
          </div>
          <div className="progress-bar"><span /></div>
          {steps.map(([title, description, status], index) => (
            <div className="progress-step" key={title}>
              <span>{index + 1}</span>
              <div>
                <b>{title}</b>
                <p>{description}</p>
              </div>
              <em>{status}</em>
            </div>
          ))}
          <button type="button" onClick={completeAnalysis}>결과 보기</button>
        </article>
        <aside className="progress-aside">
          <h2>분석 정확도를 높이는 중입니다</h2>
          <p>커밋 메시지, 변경 파일, diff 내용을 함께 비교해 맥락을 파악합니다.</p>
          <div className="rocket-card">↗</div>
        </aside>
      </section>
    </PageShell>
  );
};

export default AnalysisProgressPage;
