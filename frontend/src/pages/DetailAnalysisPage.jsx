import { useState } from "react";
import PageShell from "@pages/PageShell";

const codeBlock = `export const refreshSession = async () => {
  const response = await api.post("/auth/refresh");
  return response.data.user;
};

useEffect(() => {
  const restore = async () => {
    const user = await refreshSession();
    dispatch(login(user));
  };
  restore();
}, [dispatch]);`;

const relatedCommits = [
  "feat(auth): 로그인 유지 토큰 갱신 흐름 추가",
  "fix(auth): 새로고침 후 사용자 상태 복원 실패 수정",
  "refactor(auth): 인증 API 호출 구조 정리",
];

const DetailAnalysisPage = ({ currentPage, onNavigate }) => {
  const [tab, setTab] = useState("code");

  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="상세 분석" description="파일별 변경 내용, AI 해석, 관련 커밋을 함께 확인합니다.">
      <section className="page-card file-summary-card refined-file-summary">
        <div>
          <span className="recommend-badge">인증 영역</span>
          <h2>frontend/src/App.jsx</h2>
          <p>로그인 유지와 세션 복구 흐름이 추가된 파일입니다.</p>
        </div>
        <div className="result-metrics compact">
          <article className="metric-card"><span>변경 유형</span><b>수정</b></article>
          <article className="metric-card"><span>추가 코드</span><b>+45</b></article>
          <article className="metric-card"><span>삭제 코드</span><b>-12</b></article>
          <article className="metric-card"><span>영향도</span><b>높음</b></article>
        </div>
      </section>

      <section className="detail-grid refined-detail-grid">
        <article className="code-review-card">
          <div className="code-tabs">
            <button className={tab === "code" ? "active" : ""} type="button" onClick={() => setTab("code")}>코드 변경</button>
            <button className={tab === "ai" ? "active" : ""} type="button" onClick={() => setTab("ai")}>AI 분석</button>
            <button className={tab === "commits" ? "active" : ""} type="button" onClick={() => setTab("commits")}>관련 커밋</button>
          </div>
          {tab === "code" ? <pre>{codeBlock}</pre> : null}
          {tab === "ai" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>AI 분석 결과</h2>
              <p>새로고침 시 세션을 복구하는 흐름이 추가되어 사용자가 의도치 않게 로그아웃되는 문제가 줄어듭니다.</p>
              <div className="summary-points">
                <span>앱 초기 진입 시 refresh API로 로그인 상태 복원</span>
                <span>로그인 상태에서는 주기적으로 세션 갱신 시도</span>
                <span>API 실패 시 명확하게 로그아웃 상태로 전환</span>
              </div>
            </div>
          ) : null}
          {tab === "commits" ? (
            <div className="tab-panel refined-tab-panel">
              <h2>관련 커밋</h2>
              {relatedCommits.map((commit) => <p className="commit-line" key={commit}>{commit}</p>)}
            </div>
          ) : null}
        </article>

        <aside className="analysis-side-stack">
          <article className="page-card">
            <h2>리뷰 포인트</h2>
            <div className="summary-points">
              <span>refresh API 실패 시 UX 메시지 필요</span>
              <span>세션 갱신 주기와 백엔드 TTL 정합성 확인</span>
              <span>쿠키 SameSite 정책 검토</span>
            </div>
            <button type="button" onClick={() => onNavigate("commitMessage")}>커밋 메시지 만들기</button>
          </article>
          <article className="page-card mini-chart-card">
            <h2>영향도</h2>
            <div className="impact-meter"><span style={{ "--score": "78%" }} /></div>
            <p>인증 흐름 변경이므로 테스트 우선순위가 높습니다.</p>
          </article>
        </aside>
      </section>
    </PageShell>
  );
};

export default DetailAnalysisPage;
