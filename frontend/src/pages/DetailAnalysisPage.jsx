import { useState } from "react";
import { mockOrEmpty } from "@utils/mockConfig";
import PageShell from "@pages/PageShell";

const codeBlock = `export const login = async (email, password) => {
  const user = await findUser(email);
  if (!user) throw new Error("User not found");

  const isValid = await compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  return generateToken(user);
};`;

const relatedCommits = mockOrEmpty([
  "feat(auth): 로그인 예외 처리 추가",
  "test(auth): 로그인 실패 케이스 보강",
  "refactor(auth): 토큰 생성 로직 분리",
]);

const DetailAnalysisPage = ({ currentPage, onNavigate }) => {
  const [tab, setTab] = useState("code");

  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="파일 상세 분석" description="파일별 변경 내용과 AI 분석 결과를 확인합니다.">
      <section className="page-card file-summary-card">
        <div>
          <h2>src/api/auth/login.ts</h2>
          <span>TypeScript</span>
        </div>
        <div className="result-metrics compact">
          <article className="metric-card"><span>변경 유형</span><b>수정</b></article>
          <article className="metric-card"><span>추가된 코드</span><b>+45</b></article>
          <article className="metric-card"><span>삭제된 코드</span><b>-23</b></article>
          <article className="metric-card"><span>복잡도 변화</span><b>-2</b></article>
        </div>
      </section>

      <section className="detail-grid">
        <article className="code-review-card">
          <div className="code-tabs">
            <button className={tab === "code" ? "active" : ""} type="button" onClick={() => setTab("code")}>코드 변경</button>
            <button className={tab === "ai" ? "active" : ""} type="button" onClick={() => setTab("ai")}>AI 분석 결과</button>
            <button className={tab === "commits" ? "active" : ""} type="button" onClick={() => setTab("commits")}>관련 커밋</button>
          </div>
          {tab === "code" ? <pre>{codeBlock}</pre> : null}
          {tab === "ai" ? (
            <div className="tab-panel">
              <h2>AI 분석 결과</h2>
              <p>로그인 실패 상황의 예외 처리가 명확해졌고, 인증 흐름의 가독성이 좋아졌습니다.</p>
              <div className="summary-points">
                <span>예외 메시지 분리로 디버깅 편의성 향상</span>
                <span>비밀번호 검증 흐름이 명확함</span>
                <span>토큰 생성 위치 분리로 테스트가 쉬움</span>
              </div>
            </div>
          ) : null}
          {tab === "commits" ? (
            <div className="tab-panel">
              <h2>관련 커밋</h2>
              {relatedCommits.length ? relatedCommits.map((commit) => <p key={commit}>{commit}</p>) : <p>관련 커밋 데이터가 없습니다.</p>}
            </div>
          ) : null}
        </article>

        <aside className="analysis-side-stack">
          <article className="page-card">
            <h2>AI 분석 요약</h2>
            <p>인증 API와 사용자 세션 흐름에 중간 수준의 영향이 있습니다.</p>
            <button type="button" onClick={() => onNavigate("commitMessage")}>커밋 메시지 만들기</button>
          </article>
          <article className="page-card mini-chart-card">
            <h2>영향도</h2>
            <div className="impact-meter"><span style={{ "--score": "68%" }} /></div>
            <p>테스트와 예외 처리 확인을 권장합니다.</p>
          </article>
        </aside>
      </section>
    </PageShell>
  );
};

export default DetailAnalysisPage;
