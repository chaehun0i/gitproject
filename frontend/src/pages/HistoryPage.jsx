import ActivityLineChart from "@components/charts/ActivityLineChart";
import ChangeTypeDonutChart from "@components/charts/ChangeTypeDonutChart";
import PageShell from "@pages/PageShell";

const historyItems = [
  ["ai-commit-analyzer", "Git 산출물 업로드", "분석 완료", "2026.06.30", "128", "42"],
  ["backend-server", "GitHub 연동", "분석 완료", "2026.06.29", "86", "31"],
  ["frontend-app", "GitHub 연동", "분석 중", "2026.06.28", "104", "28"],
  ["docs", "Git 산출물 업로드", "분석 대기", "2026.06.27", "-", "-"],
];

const sourceTypes = [
  { name: "Git 산출물", value: 50 },
  { name: "GitHub 연동", value: 50 },
];

const HistoryPage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="분석 내역" description="과거 분석 결과를 다시 확인합니다.">
      <section className="history-grid">
        <article className="page-card history-summary">
          <h2>최근 30일 분석 현황</h2>
          <ActivityLineChart values={[24, 44, 32, 68, 48, 76, 58, 82]} />
        </article>
        <article className="page-card history-summary">
          <h2>분석 방식 비율</h2>
          <ChangeTypeDonutChart data={sourceTypes} />
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
