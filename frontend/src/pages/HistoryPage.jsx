import { useMemo, useState } from "react";
import ActivityLineChart from "@components/charts/ActivityLineChart";
import ChangeTypeDonutChart from "@components/charts/ChangeTypeDonutChart";
import { RepositoryEmptyVisual } from "@components/common/ProductVisuals";
import PageShell from "@pages/PageShell";

const historyItems = [
  { project: "ai-commit-analyzer", branch: "feature/FE_all", source: "Git 산출물", status: "분석 완료", commits: "128", files: "42", runtime: "3분 12초", createdAt: "2026.06.30" },
  { project: "backend-server", branch: "develop", source: "GitHub", status: "분석 완료", commits: "86", files: "31", runtime: "2분 44초", createdAt: "2026.06.29" },
  { project: "frontend-app", branch: "main", source: "GitHub", status: "분석 중", commits: "104", files: "28", runtime: "진행 중", createdAt: "2026.06.28" },
  { project: "docs", branch: "main", source: "Git 산출물", status: "분석 대기", commits: "-", files: "-", runtime: "-", createdAt: "2026.06.27" },
];

const sourceTypes = [
  { name: "Git 산출물", value: 50 },
  { name: "GitHub 연동", value: 50 },
];

const HistoryPage = ({ currentPage, onNavigate }) => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("전체 상태");

  const filteredHistory = useMemo(() => {
    return historyItems.filter((item) => {
      const matchesKeyword = `${item.project} ${item.branch}`.toLowerCase().includes(keyword.toLowerCase());
      const matchesStatus = status === "전체 상태" || item.status === status;
      return matchesKeyword && matchesStatus;
    });
  }, [keyword, status]);

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="분석 내역"
      description="DB에 저장된 과거 분석 결과를 다시 조회하는 화면입니다."
    >
      <section className="history-grid">
        <article className="page-card history-summary">
          <h2>최근 30일 분석 흐름</h2>
          <ActivityLineChart values={[24, 44, 32, 68, 48, 76, 58, 82]} />
        </article>
        <article className="page-card history-summary">
          <h2>분석 방식 비율</h2>
          <ChangeTypeDonutChart data={sourceTypes} />
        </article>
      </section>

      <section className="table-card history-table">
        <div className="history-toolbar">
          <label>
            검색
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="프로젝트명 또는 브랜치" />
          </label>
          <label>
            상태
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>전체 상태</option>
              <option>분석 완료</option>
              <option>분석 중</option>
              <option>분석 대기</option>
            </select>
          </label>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="history-empty">
            <RepositoryEmptyVisual />
            <h2>조회된 분석 내역이 없습니다</h2>
            <p>검색어 또는 상태 필터를 변경하거나 새 분석을 시작하세요.</p>
            <button type="button" onClick={() => onNavigate("newAnalysis")}>새 분석 시작</button>
          </div>
        ) : (
          <>
            <div className="table-row table-head">
              <span>프로젝트</span>
              <span>상태</span>
              <span>커밋</span>
              <span>실행 시간</span>
              <span>결과</span>
            </div>
            {filteredHistory.map((item) => (
              <div className="table-row" key={`${item.project}-${item.createdAt}`}>
                <div>
                  <b>{item.project}</b>
                  <small>{item.source} · {item.branch} · {item.createdAt}</small>
                </div>
                <span className={item.status === "분석 완료" ? "done-label" : "wait-label"}>{item.status}</span>
                <span>{item.commits} 커밋 · {item.files} 파일</span>
                <span>{item.runtime}</span>
                <button type="button" onClick={() => onNavigate(item.status === "분석 중" ? "progress" : "result")}>보기</button>
              </div>
            ))}
          </>
        )}
      </section>
    </PageShell>
  );
};

export default HistoryPage;
