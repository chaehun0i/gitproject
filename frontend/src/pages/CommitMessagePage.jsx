import MessageTypeBarChart from "@components/charts/MessageTypeBarChart";
import PageShell from "@pages/PageShell";
import { notify } from "@utils/feedback";

const recommendedMessages = [
  {
    text: "feat(auth): 로그인 세션 refresh 플로우 추가",
    type: "feat",
    scope: "auth",
    reason: "새로고침 후 로그인 유지와 Redis 세션 갱신 흐름이 추가되었습니다.",
  },
  {
    text: "fix(auth): refresh 실패 시 인증 상태 복구 처리 개선",
    type: "fix",
    scope: "auth",
    reason: "refresh API 실패 시 프론트 상태와 UX 메시지를 정리한 변경입니다.",
  },
  {
    text: "refactor(api): 인증 API 호출 구조 정리",
    type: "refactor",
    scope: "api",
    reason: "로그인, 로그아웃, 세션 복구 API 호출 경계를 분리했습니다.",
  },
  {
    text: "docs(db): 분석 결과 저장 테이블 구조 문서화",
    type: "docs",
    scope: "db",
    reason: "analysis_runs, analysis_files, ai_findings 저장 구조가 추가되었습니다.",
  },
];

const messageStats = [
  { name: "feat", value: 84 },
  { name: "fix", value: 62 },
  { name: "refactor", value: 48 },
  { name: "docs", value: 28 },
  { name: "chore", value: 16 },
];

const CommitMessagePage = ({ currentPage, onNavigate }) => {
  const copyMessage = (message) => {
    navigator.clipboard?.writeText(message);
    notify.success("커밋 메시지를 복사했습니다.");
  };

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="커밋 메시지 생성"
      description="AI 분석 결과를 바탕으로 Conventional Commit 메시지를 추천합니다."
    >
      <section className="commit-message-layout refined-message-layout">
        <div className="message-list">
          {recommendedMessages.map((message, index) => (
            <article className={index === 0 ? "message-card selected-message" : "message-card"} key={message.text}>
              <div className="message-card-head">
                <span className="recommend-badge">AI 추천 {index + 1}</span>
                <button type="button" onClick={() => copyMessage(message.text)}>복사</button>
              </div>
              <code>{message.text}</code>
              <p>{message.reason}</p>
              <div className="message-tags">
                <span>{message.type}</span>
                <span>{message.scope}</span>
                <span>Conventional Commit</span>
              </div>
            </article>
          ))}
        </div>

        <aside className="page-card commit-side-card refined-commit-side">
          <h2>이번 분석 요약</h2>
          <div className="commit-mini-summary">
            <span><b>128</b>커밋</span>
            <span><b>42</b>변경 파일</span>
            <span><b>92%</b>적용률</span>
          </div>
          <p>
            인증 흐름과 세션 복구 변경이 중심이므로 auth scope 메시지를 우선 추천합니다.
            추천 근거는 AI 분석 결과와 diff parser 집계 데이터를 기반으로 표시됩니다.
          </p>
          <MessageTypeBarChart data={messageStats} />
          <div className="side-actions">
            <button type="button" onClick={() => copyMessage(recommendedMessages[0].text)}>대표 메시지 복사</button>
            <button type="button" onClick={() => onNavigate("history")}>분석 내역 보기</button>
          </div>
        </aside>
      </section>
    </PageShell>
  );
};

export default CommitMessagePage;
