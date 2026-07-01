import { useEffect, useMemo, useState } from "react";
import AnalysisStartDialog from "@components/analysis/AnalysisStartDialog";
import PageShell from "@pages/PageShell";
import { getProjects } from "../api";
import { useMocks } from "@utils/mockConfig";
import "@styles/pages/pageCommon.css";
import "@styles/pages/newAnalysisPage.css";

const analysisOptions = [
  ["summary", "변경 요약", "파일별 변경 흐름과 핵심 내용을 정리합니다."],
  ["risk", "검토 항목 찾기", "주의해서 확인하면 좋은 변경을 표시합니다."],
  ["message", "커밋 메시지 추천", "변경 내용에 맞는 메시지 후보를 제안합니다."],
  ["refactor", "개선 포인트", "정리하면 좋은 중복 코드와 구조를 찾아줍니다."],
];

const commandGuide = [
  {
    title: "현재 커밋하지 않은 작업 저장",
    commands: [
      "git status --short > changed-files.txt",
      "git diff > working-changes.diff",
      "git diff --staged > staged-changes.diff",
    ],
  },
  {
    title: "브랜치에 이미 커밋된 변경 저장",
    commands: [
      "git fetch origin",
      "git log --reverse --stat --patch origin/main..HEAD > commit-history.patch",
      "git diff origin/main...HEAD > branch-changes.diff",
      "git diff --name-status origin/main...HEAD > branch-changed-files.txt",
    ],
  },
  {
    title: "커밋된 변경과 현재 작업까지 함께 저장",
    commands: [
      "git fetch origin",
      "git log --reverse --stat --patch origin/main..HEAD > commit-history.patch",
      "git diff origin/main > all-current-changes.diff",
      "git diff --name-status origin/main > all-current-changed-files.txt",
      "git status --short > working-status.txt",
    ],
  },
];

const NewAnalysisPage = ({ currentPage, onNavigate }) => {
  const [sourceType, setSourceType] = useState("upload");
  const [range, setRange] = useState("최근 30일");
  const [projectName, setProjectName] = useState(useMocks ? "ai-commit-analyzer" : "");
  const [branch, setBranch] = useState(useMocks ? "feature/FE_all" : "");
  const [projectOptions, setProjectOptions] = useState([]);
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

  useEffect(() => {
    if (useMocks) return undefined;

    let mounted = true;

    const loadProjects = async () => {
      try {
        const projects = await getProjects();
        if (!mounted) return;

        setProjectOptions(projects);
        setProjectName((current) => current || projects[0]?.name || "");
        setBranch((current) => current || projects[0]?.branch || "");
      } catch {
        if (mounted) {
          setProjectOptions([]);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="새 분석 시작"
      description="저장소 연결 또는 파일 업로드 방식으로 변경 내용을 분석합니다."
    >
      <section className="analysis-workspace">
        <div className="analysis-start-card refined-analysis-card">
          <article className="analysis-section">
            <span className="section-number">1</span>
            <div>
              <h2>분석 방식 선택</h2>
              <p>프로젝트 상황에 맞게 저장소 연결 분석과 Git 산출물 업로드 분석 중 하나를 선택합니다.</p>
              <div className="source-choice-grid">
                <button className={sourceType === "github" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("github")}>
                  <b>GitHub 저장소 분석</b>
                  <small>연결된 저장소, 브랜치, 기간을 선택해 분석합니다.</small>
                </button>
                <button className={sourceType === "upload" ? "source-choice active" : "source-choice"} type="button" onClick={() => setSourceType("upload")}>
                  <b>Git 산출물 업로드 분석</b>
                  <small>직접 저장한 log, diff, patch 파일을 업로드합니다.</small>
                </button>
              </div>
            </div>
          </article>

          <article className="analysis-section">
            <span className="section-number">2</span>
            <div>
              <h2>대상과 범위</h2>
              <div className="form-grid-2">
                <label>
                  프로젝트
                  {useMocks ? (
                    <input placeholder="예: ai-commit-analyzer" value={projectName} onChange={(event) => setProjectName(event.target.value)} />
                  ) : (
                    <select value={projectName} onChange={(event) => {
                      const selected = projectOptions.find((project) => project.name === event.target.value);
                      setProjectName(event.target.value);
                      setBranch(selected?.branch ?? "");
                    }}>
                      {projectOptions.length === 0 ? <option value="">연결된 프로젝트 없음</option> : null}
                      {projectOptions.map((project) => <option key={project.id} value={project.name}>{project.name}</option>)}
                    </select>
                  )}
                </label>
                <label>
                  브랜치
                  <select value={branch} onChange={(event) => setBranch(event.target.value)}>
                    {branch ? <option>{branch}</option> : <option value="">브랜치 없음</option>}
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
              <div className="compact-check-list inline">
                {analysisOptions.map(([key, title, text]) => (
                  <label className="compact-check-row" key={key}>
                    <input checked={options.includes(key)} type="checkbox" onChange={() => toggleOption(key)} />
                    <span>
                      <b>{title}</b>
                      <small>{text}</small>
                    </span>
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
                <p>민감한 토큰, 비밀번호, 운영 환경 값은 업로드 전에 제거하는 것을 권장합니다.</p>
                <div className="command-help">
                  {commandGuide.map((group) => (
                    <div className="command-group" key={group.title}>
                      <span>{group.title}</span>
                      {group.commands.map((command) => <code key={command}>{command}</code>)}
                    </div>
                  ))}
                  <small>
                    base 브랜치가 main이 아니면 origin/main을 실제 base 브랜치로 바꾸세요.
                    `git diff origin/main...HEAD`는 base 이후 커밋 변경만, `git diff origin/main`은 현재 작업트리 변경까지 포함합니다.
                  </small>
                </div>
              </div>
            </article>
          ) : null}

          <AnalysisStartDialog
            onStart={() => onNavigate("progress")}
            trigger={<button className="analysis-submit" type="button">설정 확인 후 분석 시작</button>}
          />
        </div>

        <aside className="analysis-preview-card">
          <h2>분석 미리보기</h2>
          <p>선택한 옵션에 맞춰 변경 요약과 추천 메시지를 준비합니다.</p>
          <div className="preview-row"><span>입력 방식</span><b>{sourceType === "upload" ? "Git 산출물 업로드" : "GitHub 저장소 연결"}</b></div>
          <div className="preview-row"><span>분석 범위</span><b>{range}</b></div>
          <div className="preview-row"><span>분석 옵션</span><b>{selectedOptionText || "선택 없음"}</b></div>
          <div className="summary-points">
            <span>커밋 기록을 작업 단위로 정리합니다.</span>
            <span>파일별 변경 내용을 한눈에 볼 수 있게 묶습니다.</span>
            <span>분석 결과에 맞는 메시지 후보를 생성합니다.</span>
          </div>
        </aside>
      </section>
    </PageShell>
  );
};

export default NewAnalysisPage;
