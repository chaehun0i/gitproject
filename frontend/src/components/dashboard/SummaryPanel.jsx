const summaryItems = [
  ["분석한 프로젝트", "문서", "전체 12개"],
  ["총 커밋 수", "브랜치", "▲ 12.4%"],
  ["분석 완료", "차트", "전체 12개"],
  ["AI 분석 성공률", "추세", "▼ 4.7%"],
];

const SummaryPanel = ({ projectCount }) => {
  const values = [projectCount, "1,248", 8, "92%"];

  return (
    <aside className="summary-panel">
      <div className="panel-title">
        <h2>오늘의 요약</h2>
        <span>2024.06.26</span>
      </div>
      <div className="summary-list">
        {summaryItems.map(([label, icon, meta], index) => (
          <div key={label}>
            <span>{icon}</span>
            <div>
              <p>{label}</p>
              <b>{values[index]}</b>
            </div>
            <small>{meta}</small>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SummaryPanel;
