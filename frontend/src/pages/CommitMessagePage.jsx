import MessageTypeBarChart from "@components/charts/MessageTypeBarChart";
import PageShell from "@pages/PageShell";
import { notify } from "@utils/feedback";

const messages = [
  { text: "feat(auth): 로그인 유지 토큰 갱신 흐름 추가", type: "feat", scope: "auth", tone: "추천" },
  { text: "fix(auth): 새로고침 후 세션 복원 실패 수정", type: "fix", scope: "auth", tone: "안정화" },
  { text: "refactor(auth): 인증 API 호출 구조 정리", type: "refactor", scope: "auth", tone: "구조 개선" },
];

const messageStats = [
  { name: "feat", value: 84 },
  { name: "fix", value: 62 },
  { name: "refactor", value: 48 },
  { name: "docs", value: 28 },
];

const CommitMessagePage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="커밋 메시지 생성" description="AI 추천 메시지를 선택하거나 수정해서 사용할 수 있습니다.">
      <section className="commit-message-layout refined-message-layout">
        <div className="message-list">
          {messages.map((message, index) => (
            <article className={index === 0 ? "message-card selected-message" : "message-card"} key={message.text}>
              <div className="message-card-head">
                <span className="recommend-badge">AI {message.tone}</span>
                <button type="button" onClick={() => notify.success("커밋 메시지를 복사했습니다.")}>복사</button>
              </div>
              <code>{message.text}</code>
              <div className="message-tags">
                <span>{message.type}</span>
                <span>{message.scope}</span>
                <span>{message.tone}</span>
              </div>
            </article>
          ))}
        </div>

        <aside className="page-card commit-side-card refined-commit-side">
          <h2>이번 분석 요약</h2>
          <div className="commit-mini-summary">
            <span><b>128</b>커밋</span>
            <span><b>42</b>변경 파일</span>
            <span><b>8</b>리뷰 필요</span>
          </div>
          <p>인증 흐름, 세션 복구, 설정 구조 변경이 핵심이므로 `auth` scope 메시지를 우선 추천합니다.</p>
          <MessageTypeBarChart data={messageStats} />
          <div className="side-actions">
            <button type="button" onClick={() => notify.info("대표 메시지를 복사했습니다.")}>대표 메시지 복사</button>
            <button type="button" onClick={() => onNavigate("history")}>내역으로 이동</button>
          </div>
        </aside>
      </section>
    </PageShell>
  );
};

export default CommitMessagePage;
