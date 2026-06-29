import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import PageShell from "@pages/PageShell";

const optionCards = [
  ["AI 코드 변경 분석", "코드 변경 내용을 요약하고 영향도를 분석합니다."],
  ["커밋 메시지 제안", "변경 내용을 기반으로 커밋 메시지를 추천합니다."],
  ["리포트 생성", "분석 결과를 문서 형태로 정리합니다."],
];

const NewAnalysisPage = ({ currentPage, onNavigate }) => {
  const startAnalysis = () => {
    onNavigate("progress");
  };

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="새 분석 시작"
      description="분석할 자료와 범위를 선택하세요."
    >
      <section className="analysis-start-card">
        <article className="analysis-section">
          <span className="section-number">1</span>
          <div>
            <h2>자료 연결</h2>
            <p>Git 산출물을 업로드하거나 GitHub 저장소를 연결합니다.</p>
            <div className="source-choice-grid">
              <div className="source-choice active">
                <b>Git 산출물 업로드</b>
                <small>git log, git diff, 변경 파일 목록</small>
              </div>
              <div className="source-choice">
                <b>GitHub 저장소 연동</b>
                <small>저장소와 브랜치를 직접 선택</small>
              </div>
            </div>
          </div>
        </article>

        <article className="analysis-section">
          <span className="section-number">2</span>
          <div>
            <h2>분석 범위 설정</h2>
            <label>브랜치<select><option>main</option><option>develop</option></select></label>
            <div className="range-buttons">
              <button type="button">최근 7일</button>
              <button className="active" type="button">최근 30일</button>
              <button type="button">최근 90일</button>
              <button type="button">직접 선택</button>
            </div>
            <div className="commit-range">
              <input placeholder="a7b3c3d" />
              <input placeholder="f4e5d6c" />
            </div>
          </div>
        </article>

        <article className="analysis-section">
          <span className="section-number">3</span>
          <div>
            <h2>분석 옵션</h2>
            <div className="analysis-option-grid">
              {optionCards.map(([title, text]) => (
                <label className="option-card" key={title}>
                  <input defaultChecked type="checkbox" />
                  <b>{title}</b>
                  <small>{text}</small>
                </label>
              ))}
            </div>
          </div>
        </article>

        <AnalysisStartDialog
          onStart={startAnalysis}
          trigger={<button className="analysis-submit" type="button">분석 시작하기</button>}
        />
      </section>
    </PageShell>
  );
};

export default NewAnalysisPage;
