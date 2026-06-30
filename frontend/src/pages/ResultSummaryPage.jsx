import ActivityLineChart from "@components/charts/ActivityLineChart";
import ChangeTypeDonutChart from "@components/charts/ChangeTypeDonutChart";
import { InsightVisual } from "@components/common/ProductVisuals";
import PageShell from "@pages/PageShell";

const summaryMetrics = [
  ["분석 커밋", "128", "Git Parser 수집"],
  ["변경 파일", "42", "Diff Parser 집계"],
  ["추가 라인", "+2,345", "기능 영역 집중"],
  ["삭제 라인", "-1,234", "중복 로직 제거"],
  ["위험 포인트", "8", "AI 리뷰 필요"],
];

const summaryChangeTypes = [
  { name: "기능 추가", value: 40 },
  { name: "버그 수정", value: 28 },
  { name: "리팩토링", value: 20 },
  { name: "문서/기타", value: 12 },
];

const reviewPoints = [
  "refresh API 실패 시 UX 메시지와 로그아웃 처리 확인",
  "Redis TTL과 프론트 세션 갱신 주기 정합성 검토",
  "MariaDB 저장 테이블의 analysis_run 상태 전이 확인",
  "인증 변경 구간에 대한 e2e 테스트 보강",
];

const ResultSummaryPage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="분석 결과 요약"
      description="백엔드 분석 파이프라인이 만든 집계 결과와 AI 요약을 한 화면에서 확인합니다."
    >
      <section className="result-action-bar page-card">
        <div>
          <span className="recommend-badge">analysis_run #15 · DB 저장 완료</span>
          <h2>ai-commit-analyzer 분석이 완료되었습니다</h2>
          <p>Git 산출물 파싱, diff 분석, AI 요약, 추천 메시지 생성 결과가 MariaDB 집계 데이터로 정리되었습니다.</p>
        </div>
        <div className="result-actions">
          <button type="button">결과 공유</button>
          <button type="button">PDF 내보내기</button>
        </div>
      </section>

      <section className="result-metrics">
        {summaryMetrics.map(([label, value, hint]) => (
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
          <p>
            인증 세션 복구, API 응답 처리, 프론트 상태 복원 로직이 주요 변경으로 확인되었습니다.
            백엔드의 Redis/JWE 세션 유지 흐름과 프론트 Redux 복구 흐름이 함께 연결됩니다.
          </p>
          <div className="summary-points">
            <span>로그인 유지와 refresh 토큰 갱신 흐름 개선</span>
            <span>Git 업로드 분석과 GitHub 분석 플로우 분리</span>
            <span>AI 결과 요약과 추천 커밋 메시지 후보 생성</span>
          </div>
        </article>
        <article className="page-card chart-card">
          <h2>변경 유형 분포</h2>
          <ChangeTypeDonutChart data={summaryChangeTypes} />
        </article>
        <article className="page-card chart-card wide">
          <h2>AI 활동 요약</h2>
          <ActivityLineChart values={[32, 58, 44, 71, 49, 82, 65, 92, 56, 74]} />
        </article>
        <article className="page-card risk-card result-review-card">
          <div className="panel-title">
            <h2>주요 리뷰 포인트</h2>
            <InsightVisual />
          </div>
          {reviewPoints.map((item, index) => (
            <div className="risk-row" key={item}>
              <b>{index + 1}</b>
              <span>{item}</span>
              <em>{index < 2 ? "높음" : "보통"}</em>
            </div>
          ))}
        </article>
      </section>

      <section className="page-card ai-summary-card completion-card">
        <div>
          <span className="recommend-badge">분석 완료</span>
          <h2>AI 종합 요약</h2>
          <p>이번 변경은 인증 안정성과 분석 워크플로우를 보강한 작업입니다. 다음 단계에서는 refresh 실패 테스트와 DB 저장 상태 검증을 우선 확인하는 것이 좋습니다.</p>
        </div>
        <button type="button" onClick={() => onNavigate("detail")}>파일 상세 분석 보기</button>
      </section>
    </PageShell>
  );
};

export default ResultSummaryPage;
