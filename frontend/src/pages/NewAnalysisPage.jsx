import { useState } from "react";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import PageShell from "@pages/PageShell";

const analysisOptions = [
  ["code", "코드 변경 분석", "파일별 변경 의도와 영향도를 요약합니다."],
  ["message", "커밋 메시지 추천", "Conventional Commits 형식으로 메시지를 제안합니다."],
  ["risk", "위험 변경 감지", "인증, 환경변수, DB 변경 등 주의 지점을 찾습니다."],
];

const NewAnalysisPage = ({ currentPage, onNavigate }) => {
  const [sourceType, setSourceType] = useState("upload");
  const [range, setRange] = useState("최근 30일");
  const [options, setOptions] = useState(["code", "message", "risk"]);

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
      description="분석 방식과 범위를 선택한 뒤 약관 확인 후 분석을 시작합니다."
    >
      <section className="analysis-workspace">
        <div className="analysis-start-card refined-analysis-card">
          <article className="analysis-section">
            <span className="section-number">1</span>
            <div>
              <h2>분석 방식</h2>
              <p>현재 프로젝트는 파일 업로드 분석과 GitHub 연동 분석을 모두 지원하는 화면 흐름으로 구성합니다.</p>
              <div className="source-choice-grid">
                <button className={sourceType === "upload" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("upload")}>
                  <b>Git 산출물 업로드</b>
                  <small>사용자가 git 명령어로 저장한 log, diff, patch, 변경 파일 목록을 업로드합니다.</small>
                </button>
                <button className={sourceType === "github" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("github")}>
                  <b>GitHub 저장소 연동</b>
                  <small>저장소, 브랜치, 커밋 범위를 선택해 분석합니다.</small>
                </button>
              </div>
            </div>
          </article>

          <article className="analysis-section">
            <span className="section-number">2</span>
            <div>
              <h2>기본 정보</h2>
              <div className="form-grid-2">
                <label>프로젝트명<input placeholder="예: ai-commit-analyzer" /></label>
                <label>브랜치<select><option>main</option><option>develop</option><option>feature/FE_all</option></select></label>
              </div>
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
                {analysisOptions.map(([key, title, text]) => (
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
            onStart={() => onNavigate("progress")}
            trigger={<button className="analysis-submit" type="button">약관 확인 후 분석 시작</button>}
          />
        </div>

        <aside className="analysis-preview-card">
          <h2>업로드 권장 명령어</h2>
          <code>git log --stat --patch &gt; commit-history.patch</code>
          <code>git diff main...HEAD &gt; changes.diff</code>
          <code>git diff --name-only main...HEAD &gt; changed-files.txt</code>
          <p>민감한 토큰, 비밀번호, 운영 환경 키가 포함되지 않았는지 업로드 전에 확인하세요.</p>
        </aside>
      </section>
    </PageShell>
  );
};

export default NewAnalysisPage;
