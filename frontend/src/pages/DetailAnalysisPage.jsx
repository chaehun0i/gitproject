import { useEffect, useState } from "react";
import PageShell from "@pages/PageShell";
import { getAnalysisDetail } from "../api";
import { useMocks } from "@utils/mockConfig";
import "@styles/pages/pageCommon.css";
import "@styles/pages/detailAnalysisPage.css";

const files = [
  ["src/api/auth/login.ts", "TypeScript", "수정", "+45", "-23", "높음"],
  ["src/utils/tokenset.py", "Python", "수정", "+28", "-8", "중간"],
  ["src/styles/pages/auth.css", "CSS", "수정", "+92", "-31", "낮음"],
  ["backend/src/utils/rediscl.py", "Python", "추가", "+64", "-0", "중간"],
];

const detailFiles = [
  ...files,
  ["src/pages/HomePage.jsx", "React", "\uC218\uC815", "+38", "-14", "\uB0AE\uC74C"],
  ["src/components/analysis/AnalysisStartDialog.jsx", "React", "\uC218\uC815", "+72", "-19", "\uC911\uAC04"],
  ["src/styles/pages/detailAnalysisPage.css", "CSS", "\uC218\uC815", "+116", "-22", "\uB0AE\uC74C"],
  ["src/stores/slices/authSlice.js", "JavaScript", "\uC218\uC815", "+31", "-9", "\uC911\uAC04"],
];

const diffLines = [
  ["ctx", "export const login = async (email, password) => {"],
  ["del", "  const token = await api.post('/auth/login', { email, password });"],
  ["del", "  localStorage.setItem('token', token);"],
  ["add", "  const response = await api.post('/auth/login', { email, password });"],
  ["add", "  await refreshSession();"],
  ["add", "  return response.data.user;"],
  ["ctx", "};"],
  ["ctx", ""],
  ["add", "export const restoreSession = async () => {"],
  ["add", "  const user = await api.post('/auth/refresh');"],
  ["add", "  return user.data;"],
  ["add", "};"],
];

const analysisPoints = [
  ["로그인 유지", "새로고침 후 refresh API로 JWE 세션을 복구하는 흐름이 추가되었습니다."],
  ["상태 복구", "사용자 식별 정보와 로그인 유지 상태를 분리해 안정적으로 관리하는 흐름입니다."],
  ["분석 기록", "프로젝트, 파일, 커밋, 요약 결과를 다시 확인하기 좋은 구조로 정리됩니다."],
  ["위험 요소", "refresh 실패 시 UX 메시지와 강제 로그아웃 처리가 필요합니다."],
];

const commits = [
  "feat(auth): 로그인 세션 refresh 플로우 추가",
  "fix(auth): 새로고침 후 인증 상태 복구 실패 수정",
  "refactor(api): 인증 API 호출 구조 정리",
];

const issues = [
  ["AUTH-12", "로그인 유지 만료 시 화면 상태 처리 검증"],
  ["API-08", "refresh 응답 스키마 통일"],
  ["TEST-21", "로그인 유지 e2e 테스트 추가"],
];

const tabs = {
  code: "코드 변경",
  ai: "AI 분석 결과",
  commits: "관련 커밋",
  issues: "연결 이슈",
};

const DetailAnalysisPage = ({ currentPage, onNavigate }) => {
  const emptyFile = ["", "", "", "", "", ""];
  const [tab, setTab] = useState("code");
  const [selectedFile, setSelectedFile] = useState(useMocks ? detailFiles[0] : emptyFile);
  const [analysisFiles, setAnalysisFiles] = useState(useMocks ? detailFiles : []);
  const [runtimeDiffLines, setRuntimeDiffLines] = useState(useMocks ? diffLines : []);
  const [runtimeAnalysisPoints, setRuntimeAnalysisPoints] = useState(useMocks ? analysisPoints : []);
  const [runtimeCommits, setRuntimeCommits] = useState(useMocks ? commits : []);
  const [runtimeIssues, setRuntimeIssues] = useState(useMocks ? issues : []);
  const [fileQuery, setFileQuery] = useState("");
  const [filePage, setFilePage] = useState(1);
  const [fileName, language, changeType, added, removed, risk] = selectedFile;
  const pageSize = 5;
  const filteredFiles = analysisFiles.filter((file) => file[0].toLowerCase().includes(fileQuery.toLowerCase()));
  const totalFilePages = Math.max(1, Math.ceil(filteredFiles.length / pageSize));
  const pagedFiles = filteredFiles.slice((filePage - 1) * pageSize, filePage * pageSize);

  useEffect(() => {
    let mounted = true;

    const loadDetail = async () => {
      try {
        const data = await getAnalysisDetail();
        const nextFiles = data.files ?? [];
        if (mounted) {
          setAnalysisFiles(nextFiles);
          setRuntimeDiffLines(data.diffLines ?? []);
          setRuntimeAnalysisPoints(data.analysisPoints ?? []);
          setRuntimeCommits(data.commits ?? []);
          setRuntimeIssues(data.issues ?? []);
          setSelectedFile(nextFiles[0] ?? emptyFile);
        }
      } catch {
        if (mounted) {
          setAnalysisFiles([]);
          setRuntimeDiffLines([]);
          setRuntimeAnalysisPoints([]);
          setRuntimeCommits([]);
          setRuntimeIssues([]);
          setSelectedFile(emptyFile);
        }
      }
    };

    loadDetail();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="파일 상세 분석"
      description="파일별 diff, AI 해석, 관련 커밋과 이슈를 함께 확인합니다."
    >
      <section className="detail-hero page-card">
        <div>
          <span className="recommend-badge">파일 변경 분석</span>
          <h2>{fileName}</h2>
          <p>
            인증 API 흐름과 세션 복구 로직이 함께 변경된 파일입니다. AI 분석은 코드 변경,
            영향도와 검토할 변경 사항을 함께 정리합니다.
          </p>
        </div>
        <div className="result-metrics compact">
          <article className="metric-card"><span>언어</span><b>{language}</b><small>파서 선택 기준</small></article>
          <article className="metric-card"><span>변경 유형</span><b>{changeType}</b><small>diff 분류</small></article>
          <article className="metric-card"><span>라인 변경</span><b>{added} / {removed}</b><small>추가 / 삭제</small></article>
          <article className="metric-card"><span>위험도</span><b>{risk}</b><small>AI 평가</small></article>
        </div>
      </section>

      <section className="detail-workspace">
        <aside className="page-card file-navigator">
          <div className="panel-title">
            <h2>변경 파일</h2>
            <span className="recommend-badge">{filteredFiles.length} files</span>
          </div>
          <input
            className="file-search"
            value={fileQuery}
            onChange={(event) => {
              setFileQuery(event.target.value);
              setFilePage(1);
            }}
            placeholder="파일 검색"
          />
          {pagedFiles.map((file) => (
            <button
              className={file[0] === fileName ? "file-item active" : "file-item"}
              key={file[0]}
              type="button"
              onClick={() => setSelectedFile(file)}
            >
              <span>{file[1].slice(0, 2).toUpperCase()}</span>
              <div>
                <b>{file[0]}</b>
                <small>{file[2]} · {file[3]} {file[4]} · 위험도 {file[5]}</small>
              </div>
            </button>
          ))}
          <div className="pagination-row compact">
            <button disabled={filePage === 1} type="button" onClick={() => setFilePage((value) => Math.max(1, value - 1))}>이전</button>
            <span>{filePage} / {totalFilePages}</span>
            <button disabled={filePage === totalFilePages} type="button" onClick={() => setFilePage((value) => Math.min(totalFilePages, value + 1))}>다음</button>
          </div>
        </aside>

        <article className="code-review-card premium-code-card">
          <div className="code-tabs">
            {Object.entries(tabs).map(([key, label]) => (
              <button className={tab === key ? "active" : ""} type="button" key={key} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {tab === "code" ? (
            <div className="code-editor">
              <div className="editor-top">
                <span />
                <span />
                <span />
                <b>{fileName}</b>
              </div>
              <div className="diff-body">
                {runtimeDiffLines.length > 0 ? runtimeDiffLines.map(([type, line], index) => (
                  <div className={`diff-line ${type}`} key={`${type}-${index}`}>
                    <i>{index + 1}</i>
                    <code>{line || " "}</code>
                  </div>
                )) : <div className="diff-line ctx"><i>-</i><code>표시할 코드 변경이 없습니다.</code></div>}
              </div>
            </div>
          ) : null}

          {tab === "ai" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>AI 분석 결과</h2>
              <p>{runtimeAnalysisPoints.length > 0 ? "분석 결과에서 확인된 주요 변경 사항입니다." : "표시할 AI 분석 결과가 없습니다."}</p>
              <div className="summary-points">
                {runtimeAnalysisPoints.map(([title, text]) => (
                  <span key={title}><b>{title}</b>{text}</span>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "commits" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>관련 커밋</h2>
              {runtimeCommits.map((commit) => <p className="commit-line" key={commit}>{commit}</p>)}
            </div>
          ) : null}

          {tab === "issues" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>연결 이슈</h2>
              {runtimeIssues.map(([key, title]) => (
                <p className="commit-line" key={key}><b>{key}</b> {title}</p>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="analysis-side-stack detail-ai-panel">
          <article className="page-card">
            <h2>AI 요약</h2>
            <p>
              사용자 인증 상태 복구와 refresh 토큰 갱신 흐름이 핵심 변경입니다.
              로그인 유지 상태와 화면 복구 흐름이 함께 연결됩니다.
            </p>
            <div className="impact-meter"><span style={{ "--score": "78%" }} /></div>
            <small>영향도 78% · 인증/세션 영역</small>
          </article>
          <article className="page-card pipeline-meta-card">
            <h2>저장 구조</h2>
            <div className="summary-points">
              <span><b>analysis_runs</b> 실행 상태와 진행률</span>
              <span><b>analysis_files</b> 파일별 diff 메타</span>
              <span><b>ai_findings</b> 요약, 위험도, 권장 조치</span>
              <span><b>commit_messages</b> 추천 메시지 후보</span>
            </div>
          </article>
          <article className="page-card">
            <h2>권장 조치</h2>
            <div className="summary-points">
              <span>refresh 실패 케이스 통합 테스트 추가</span>
              <span>로그인 유지 만료와 화면 재시도 기준 문서화</span>
              <span>로그아웃 시 세션 삭제 API 호출 확인</span>
            </div>
            <button type="button" onClick={() => onNavigate("commitMessage")}>커밋 메시지 생성</button>
          </article>
        </aside>
      </section>
    </PageShell>
  );
};

export default DetailAnalysisPage;
