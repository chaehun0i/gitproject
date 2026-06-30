import { useMemo, useState } from "react";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import { PipelineVisual } from "@components/common/ProductVisuals";
import PageShell from "@pages/PageShell";

const analysisOptions = [
  ["summary", "코드 변경 요약", "파일별 변경 의도와 핵심 변경 사항을 요약합니다."],
  ["risk", "위험 변경 감지", "인증, DB, 환경 변수처럼 주의가 필요한 변경을 감지합니다."],
  ["message", "커밋 메시지 추천", "Conventional Commit 형식으로 메시지 후보를 제안합니다."],
  ["refactor", "리팩토링 포인트", "중복 코드, 구조 개선, 테스트 보강 포인트를 찾습니다."],
];

const commandGuide = [
  "git log --stat --patch > commit-history.patch",
  "git diff main...HEAD > changes.diff",
  "git diff --name-only main...HEAD > changed-files.txt",
];

const NewAnalysisPage = ({ currentPage, onNavigate }) => {
  const [sourceType, setSourceType] = useState("upload");
  const [range, setRange] = useState("최근 30일");
  const [options, setOptions] = useState(["summary", "risk", "message"]);

  const selectedOptionText = useMemo(() => {
    return analysisOptions
      .filter(([key]) => options.includes(key))
      .map(([, title]) => title)
      .join(" · ");
  }, [options]);

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
      description="GitHub 연동 또는 Git 명령어 산출물 업로드 방식으로 분석을 실행합니다."
    >
      <section className="analysis-workspace">
        <div className="analysis-start-card refined-analysis-card">
          <article className="analysis-section">
            <span className="section-number">1</span>
            <div>
              <h2>분석 방식 선택</h2>
              <p>포트폴리오 데모에서도 백엔드 입력 구조가 보이도록 GitHub 연동과 Git 산출물 업로드를 분리했습니다.</p>
              <div className="source-choice-grid">
                <button className={sourceType === "github" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("github")}>
                  <b>GitHub 저장소 연동 분석</b>
                  <small>저장소, 브랜치, 커밋 범위를 선택해 GitHub API 기반 분석을 실행합니다.</small>
                </button>
                <button className={sourceType === "upload" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("upload")}>
                  <b>Git 명령어 산출물 업로드 분석</b>
                  <small>사용자가 저장한 log, diff, patch, 변경 파일 목록을 업로드해 분석합니다.</small>
                </button>
              </div>
            </div>
          </article>

          <article className="analysis-section">
            <span className="section-number">2</span>
            <div>
              <h2>저장소와 범위</h2>
              <div className="form-grid-2">
                <label>
                  프로젝트
                  <input placeholder="예: ai-commit-analyzer" defaultValue="ai-commit-analyzer" />
                </label>
                <label>
                  브랜치
                  <select defaultValue="feature/FE_all">
                    <option>feature/FE_all</option>
                    <option>main</option>
                    <option>develop</option>
                  </select>
                </label>
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

          {sourceType === "upload" ? (
            <article className="analysis-section upload-guide-section">
              <span className="section-number">4</span>
              <div>
                <h2>업로드 가이드</h2>
                <p>민감한 토큰, 비밀번호, 운영 환경 변수는 업로드 전에 제거하는 것을 권장합니다.</p>
                <div className="command-help">
                  {commandGuide.map((command) => <code key={command}>{command}</code>)}
                </div>
              </div>
            </article>
          ) : null}

          <AnalysisStartDialog
            onStart={() => onNavigate("progress")}
            trigger={<button className="analysis-submit" type="button">약관 확인 후 분석 시작</button>}
          />
        </div>

        <aside className="analysis-preview-card">
          <PipelineVisual />
          <h2>분석 미리보기</h2>
          <div className="preview-row"><span>입력 방식</span><b>{sourceType === "upload" ? "Git 산출물 업로드" : "GitHub 저장소 연동"}</b></div>
          <div className="preview-row"><span>분석 범위</span><b>{range}</b></div>
          <div className="preview-row"><span>분석 옵션</span><b>{selectedOptionText || "선택 없음"}</b></div>
          <div className="summary-points">
            <span>Git Parser가 커밋 로그를 구조화합니다.</span>
            <span>Diff Parser가 파일별 변경 라인을 추출합니다.</span>
            <span>AI Analyzer가 위험도와 추천 메시지를 생성합니다.</span>
          </div>
        </aside>
      </section>
    </PageShell>
  );
};

export default NewAnalysisPage;
