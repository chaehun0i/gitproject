import { useState } from "react";
import PageShell from "@pages/PageShell";

const files = [
  ["src/api/auth/login.ts", "TypeScript", "수정", "+45", "-23", "높음"],
  ["src/utils/tokenset.py", "Python", "수정", "+28", "-8", "중간"],
  ["src/styles/pages/auth.css", "CSS", "수정", "+92", "-31", "낮음"],
  ["backend/src/utils/rediscl.py", "Python", "추가", "+64", "-0", "중간"],
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
  ["Redis 연동", "토큰 자체보다 uuid 기반 세션 식별자를 Redis TTL과 함께 관리하는 구조가 드러납니다."],
  ["DB 저장", "분석 결과는 프로젝트, 파일, 커밋, AI 요약 테이블로 분리 저장하기 적합합니다."],
  ["위험 요소", "refresh 실패 시 UX 메시지와 강제 로그아웃 처리가 필요합니다."],
];

const commits = [
  "feat(auth): 로그인 세션 refresh 플로우 추가",
  "fix(auth): 새로고침 후 인증 상태 복구 실패 수정",
  "refactor(api): 인증 API 호출 구조 정리",
];

const issues = [
  ["AUTH-12", "Redis TTL 만료 시 프론트 상태 처리 검증"],
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
  const [tab, setTab] = useState("code");
  const [selectedFile, setSelectedFile] = useState(files[0]);
  const [fileName, language, changeType, added, removed, risk] = selectedFile;

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="파일 상세 분석"
      description="파일별 diff, AI 해석, 관련 커밋과 이슈를 함께 확인합니다."
    >
      <section className="detail-hero page-card">
        <div>
          <span className="recommend-badge">Git Parser · Diff Parser · AI Analyzer</span>
          <h2>{fileName}</h2>
          <p>
            인증 API 흐름과 세션 복구 로직이 함께 변경된 파일입니다. AI 분석은 코드 변경,
            영향도, DB 저장 대상 메타데이터를 함께 정리합니다.
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
            <span className="recommend-badge">{files.length} files</span>
          </div>
          {files.map((file) => (
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
                {diffLines.map(([type, line], index) => (
                  <div className={`diff-line ${type}`} key={`${type}-${index}`}>
                    <i>{index + 1}</i>
                    <code>{line || " "}</code>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "ai" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>AI 분석 결과</h2>
              <p>
                로그인 이후 세션 복구 책임이 프론트와 백엔드 refresh API로 분리되었습니다.
                JWE에는 식별자만 두고 Redis가 세션 유지 상태를 담당하는 구조가 적절합니다.
              </p>
              <div className="summary-points">
                {analysisPoints.map(([title, text]) => (
                  <span key={title}><b>{title}</b>{text}</span>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "commits" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>관련 커밋</h2>
              {commits.map((commit) => <p className="commit-line" key={commit}>{commit}</p>)}
            </div>
          ) : null}

          {tab === "issues" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>연결 이슈</h2>
              {issues.map(([key, title]) => (
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
              백엔드 Redis 세션, JWE uuid, 프론트 Redux 상태가 연결됩니다.
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
              <span>Redis TTL과 프론트 재시도 주기 문서화</span>
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
