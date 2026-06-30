import ActivityLineChart from "@components/charts/ActivityLineChart";
import ChangeTypeDonutChart from "@components/charts/ChangeTypeDonutChart";
import PageShell from "@pages/PageShell";

const metrics = [
  ["총 커밋 수", "128", "직전 분석 대비 +18"],
  ["변경 파일 수", "42", "핵심 파일 9개"],
  ["추가된 코드", "+2,345", "기능 영역 집중"],
  ["삭제된 코드", "-1,234", "중복 로직 제거"],
  ["리뷰 필요 파일", "8", "인증/세션 우선"],
];

const changeTypes = [
  { name: "기능 추가", value: 40 },
  { name: "버그 수정", value: 28 },
  { name: "리팩터링", value: 20 },
  { name: "문서/기타", value: 12 },
];

const ResultSummaryPage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="분석 결과 요약" description="핵심 지표와 AI 요약을 한눈에 확인합니다.">
      <section className="result-metrics">
        {metrics.map(([label, value, hint]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>{hint}</small>
          </article>
        ))}
      </section>

      <section className="result-dashboard-grid">
        <article className="page-card insight-card">
          <h2>변경 요약</h2>
          <p>인증 흐름 개선, API 응답 형식 통일, UI 상태 처리 보강이 주요 변경 사항으로 확인되었습니다.</p>
          <div className="summary-points">
            <span>로그인 유지 토큰 흐름 개선</span>
            <span>API 응답 오류 처리 통일</span>
            <span>프론트 상태 복원 로직 추가</span>
          </div>
        </article>
        <article className="page-card chart-card">
          <h2>변경 유형 분포</h2>
          <ChangeTypeDonutChart data={changeTypes} />
        </article>
        <article className="page-card chart-card wide">
          <h2>커밋 활동 트렌드</h2>
          <ActivityLineChart values={[32, 58, 44, 71, 49, 82, 65, 92, 56, 74]} />
        </article>
        <article className="page-card risk-card">
          <h2>리뷰 우선순위</h2>
          {["인증 실패 예외 처리", "토큰 갱신 경계 조건", "API 응답 포맷 변경", "테스트 누락 구간"].map((item, index) => (
            <div className="risk-row" key={item}>
              <b>{index + 1}</b>
              <span>{item}</span>
              <em>{index < 2 ? "높음" : "보통"}</em>
            </div>
          ))}
        </article>
      </section>

      <section className="page-card ai-summary-card">
        <h2>AI 종합 요약</h2>
        <p>인증 시스템을 개선하고 API 구조를 정리해 안정성과 유지보수성을 높인 작업입니다.</p>
        <button type="button" onClick={() => onNavigate("detail")}>상세보기</button>
      </section>
    </PageShell>
  );
};

export default ResultSummaryPage;
