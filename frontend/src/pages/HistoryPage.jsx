import PageShell from "@pages/PageShell";

const historyItems = [
  ["ai-commit-analyzer", "Git 산출물 업로드", "분석 완료", "2024.06.26", "128", "42"],
  ["backend-server", "GitHub 연동", "분석 완료", "2024.06.24", "86", "31"],
  ["frontend-app", "GitHub 연동", "분석 중", "2024.06.22", "104", "28"],
  ["docs", "Git 산출물 업로드", "분석 대기", "2024.06.20", "-", "-"],
];

const HistoryPage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="분석 내역" description="과거 분석 결과를 다시 확인합니다.">
      <section className="history-grid">
        <article className="page-card history-summary">
          <h2>최근 30일 분석 현황</h2>
          <div className="line-chart compact" aria-label="최근 30일 분석 현황">
            {[24, 44, 32, 68, 48, 76, 58, 82].map((height, index) => (
              <span style={{ "--height": `${height}%` }} key={index} />
            ))}
          </div>
        </article>
        <article className="page-card history-summary">
          <h2>분석 방식 비율</h2>
          <div className="donut-chart small"><span>2:2</span></div>
          <p>Git 산출물 업로드와 GitHub 연동을 모두 지원합니다.</p>
        </article>
      </section>

      <section className="table-card history-table">
        {historyItems.map(([name, source, status, date, commits, files]) => (
          <div className="table-row" key={name}>
            <div>
              <b>{name}</b>
              <small>{source}</small>
            </div>
            <span className={status === "분석 완료" ? "done-label" : "wait-label"}>{status}</span>
            <span>{date}</span>
            <span>{commits} 커밋 · {files} 파일</span>
            <button type="button" onClick={() => onNavigate(status === "분석 중" ? "progress" : "result")}>열기</button>
          </div>
        ))}
      </section>
    </PageShell>
  );
};

export default HistoryPage;
