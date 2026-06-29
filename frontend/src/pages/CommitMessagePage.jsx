import MessageTypeBarChart from "@components/charts/MessageTypeBarChart";
import { notify } from "@utils/feedback";
import PageShell from "@pages/PageShell";

const messages = [
  ["feat(auth): 로그인 유지 토큰 갱신 흐름 추가", "feat", "auth", "로그인 유지"],
  ["fix(auth): 세션 만료 시 사용자 상태 복원 실패 수정", "fix", "auth", "세션 처리"],
  ["refactor(auth): 인증 설정을 settings 기반으로 분리", "refactor", "auth", "구조 개선"],
];

const messageStats = [
  { name: "feat", value: 84 },
  { name: "fix", value: 62 },
  { name: "refactor", value: 48 },
  { name: "docs", value: 28 },
];

const CommitMessagePage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="AI 커밋 메시지 제안" description="분석 결과를 바탕으로 메시지를 선택하고 복사합니다.">
      <section className="commit-message-layout">
        <div className="message-list">
          {messages.map(([message, type, scope, tag]) => (
            <article className="message-card" key={message}>
              <span className="recommend-badge">AI 추천</span>
              <code>{message}</code>
              <div>
                <span>{type}</span>
                <span>{scope}</span>
                <span>{tag}</span>
              </div>
              <button type="button" onClick={() => notify.success("커밋 메시지를 복사했습니다.")}>복사</button>
            </article>
          ))}
        </div>
        <aside className="page-card commit-side-card">
          <h2>이번 분석 요약</h2>
          <div className="commit-mini-summary">
            <span><b>128</b>커밋</span>
            <span><b>42</b>변경 파일</span>
            <span><b>8</b>리뷰 필요</span>
          </div>
          <p>주요 변경 유형은 기능 추가와 리팩터링이며 인증 영역의 메시지는 Conventional Commits 규칙이 적합합니다.</p>
          <MessageTypeBarChart data={messageStats} />
          <button type="button" onClick={() => notify.info("모든 메시지를 내보냅니다.")}>모두 복사하기</button>
        </aside>
      </section>
    </PageShell>
  );
};

export default CommitMessagePage;
