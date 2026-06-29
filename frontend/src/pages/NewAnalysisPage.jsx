import { useState } from "react";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import PageShell from "@pages/PageShell";

const optionCards = [
  ["code", "AI 코드 변경 분석", "코드 변경 내용을 요약하고 영향도를 분석합니다."],
  ["message", "커밋 메시지 제안", "변경 내용을 기반으로 커밋 메시지를 추천합니다."],
  ["report", "리포트 생성", "분석 결과를 문서 형태로 정리합니다."],
];

const NewAnalysisPage = ({ currentPage, onNavigate }) => {
  const [sourceType, setSourceType] = useState("upload");
  const [range, setRange] = useState("최근 30일");
  const [options, setOptions] = useState(["code", "message", "report"]);

  const startAnalysis = () => {
    onNavigate("progress");
  };

  const toggleOption = (key) => {
    setOptions((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ));
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
              <button className={sourceType === "upload" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("upload")}>
                <b>Git 산출물 업로드</b>
                <small>git log, git diff, 변경 파일 목록</small>
              </button>
              <button className={sourceType === "github" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("github")}>
                <b>GitHub 저장소 연동</b>
                <small>저장소와 브랜치를 직접 선택</small>
              </button>
            </div>
          </div>
        </article>

        <article className="analysis-section">
          <span className="section-number">2</span>
          <div>
            <h2>분석 범위 설정</h2>
            <label>브랜치<select><option>main</option><option>develop</option></select></label>
            <div className="range-buttons">
              {["최근 7일", "최근 30일", "최근 90일", "직접 선택"].map((item) => (
                <button className={range === item ? "active" : ""} type="button" key={item} onClick={() => setRange(item)}>{item}</button>
              ))}
            </div>
            {range === "직접 선택" ? (
              <div className="commit-range">
                <input placeholder="시작 커밋 a7b3c3d" />
                <input placeholder="종료 커밋 f4e5d6c" />
              </div>
            ) : null}
          </div>
        </article>

        <article className="analysis-section">
          <span className="section-number">3</span>
          <div>
            <h2>분석 옵션</h2>
            <div className="analysis-option-grid">
              {optionCards.map(([key, title, text]) => (
                <label className="option-card" key={key}>
                  <input checked={options.includes(key)} type="checkbox" onChange={() => toggleOption(key)} />
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
