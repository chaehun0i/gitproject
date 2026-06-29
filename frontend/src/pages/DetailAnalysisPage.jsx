import PageShell from "@pages/PageShell";

const DetailAnalysisPage = ({ currentPage, onNavigate }) => {
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
            <button className="active" type="button">코드 변경</button>
            <button type="button">AI 분석 결과</button>
            <button type="button">관련 커밋</button>
          </div>
          <pre>{`export const login = async (email, password) => {\n  const user = await findUser(email);\n  if (!user) throw new Error(\"User not found\");\n\n  const isValid = await compare(password, user.password);\n  if (!isValid) throw new Error(\"Invalid password\");\n\n  return generateToken(user);\n};`}</pre>
        </article>
        <aside className="analysis-side-stack">
          <article className="page-card">
            <h2>AI 분석 결과</h2>
            <p>로그인 실패 상황의 예외 처리가 명확해졌고, 인증 흐름의 가독성이 좋아졌습니다.</p>
            <div className="summary-points">
              <span>예외 메시지 분리로 디버깅 편의성 향상</span>
              <span>비밀번호 검증 흐름이 명확함</span>
              <span>토큰 생성 위치 분리로 테스트 용이</span>
            </div>
            <button type="button" onClick={() => onNavigate("commitMessage")}>커밋 메시지 만들기</button>
          </article>
          <article className="page-card mini-chart-card">
            <h2>영향도</h2>
            <div className="impact-meter"><span style={{ "--score": "68%" }} /></div>
            <p>인증 API와 사용자 세션 흐름에 중간 수준의 영향이 있습니다.</p>
          </article>
        </aside>
      </section>
    </PageShell>
  );
};

export default DetailAnalysisPage;
