import ActivityLineChart from "@components/charts/ActivityLineChart";
import ChangeTypeDonutChart from "@components/charts/ChangeTypeDonutChart";
import { InsightVisual } from "@components/common/ProductVisuals";
import { useEffect, useState } from "react";
import PageShell from "@pages/PageShell";
import { getAnalysisSummary } from "../api";
import { useMocks } from "@utils/mockConfig";
import "@styles/pages/pageCommon.css";
import "@styles/pages/resultSummaryPage.css";

const summaryMetrics = [
  ["분석 커밋", "128", "변경 기록 기준"],
  ["변경 파일", "42", "파일 변경 기준"],
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
  "로그인 유지 실패 시 사용자 안내 흐름 검토",
  "분석 기록의 완료 상태와 재조회 흐름 확인",
  "인증 변경 구간에 대한 e2e 테스트 보강",
];

const ResultSummaryPage = ({ currentPage, onNavigate }) => {
  const [summary, setSummary] = useState({
    projectName: useMocks ? "ai-commit-analyzer" : "",
    metrics: useMocks ? summaryMetrics : [],
    changeTypes: useMocks ? summaryChangeTypes : [],
    activityValues: useMocks ? [32, 58, 44, 71, 49, 82, 65, 92, 56, 74] : [],
    reviewPoints: useMocks ? reviewPoints : [],
  });

  useEffect(() => {
    let mounted = true;

    const loadSummary = async () => {
      try {
        const data = await getAnalysisSummary();
        if (mounted) {
          setSummary({
            metrics: data.metrics ?? [],
            projectName: data.projectName ?? "",
            changeTypes: data.changeTypes ?? [],
            activityValues: data.activityValues ?? [],
            reviewPoints: data.reviewPoints ?? [],
          });
        }
      } catch {
        if (mounted) {
          setSummary({ metrics: [], changeTypes: [], activityValues: [], reviewPoints: [] });
        }
      }
    };

    loadSummary();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="분석 결과 요약"
      description="이번 분석에서 확인된 변경 요약과 검토 항목을 한 화면에서 확인합니다."
    >
      <section className="result-action-bar page-card">
        <div>
          <span className="recommend-badge">분석 완료</span>
          <h2>{summary.projectName ? `${summary.projectName} 분석이 완료되었습니다` : "분석 결과가 준비되었습니다"}</h2>
          <p>업로드한 변경 기록과 선택한 분석 옵션을 바탕으로 요약과 추천 메시지가 준비되었습니다.</p>
        </div>
        <div className="result-actions">
          <button type="button">결과 공유</button>
          <button type="button">PDF 내보내기</button>
        </div>
      </section>

      <section className="result-metrics">
        {summary.metrics.map(([label, value, hint]) => (
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
            로그인 유지 흐름과 화면 복구 흐름이 함께 개선되었습니다.
          </p>
          <div className="summary-points">
            <span>로그인 유지와 refresh 토큰 갱신 흐름 개선</span>
            <span>Git 업로드 분석과 GitHub 분석 플로우 분리</span>
            <span>AI 결과 요약과 추천 커밋 메시지 후보 생성</span>
          </div>
        </article>
        <article className="page-card chart-card">
          <h2>변경 유형 분포</h2>
          <p className="chart-description">이번 분석에서 기능 추가, 수정, 리팩토링 비중을 비교할 수 있습니다.</p>
          <ChangeTypeDonutChart data={summary.changeTypes} />
        </article>
        <article className="page-card chart-card wide">
          <h2>이번 분석에서 확인된 항목</h2>
          <p className="chart-description">분석 과정에서 확인된 주요 항목의 흐름입니다. 검토할 변경이 많아진 구간을 확인하세요.</p>
          <ActivityLineChart values={summary.activityValues} />
        </article>
        <article className="page-card risk-card result-review-card">
          <div className="panel-title">
            <h2>주요 리뷰 포인트</h2>
            <InsightVisual />
          </div>
          {summary.reviewPoints.map((item, index) => (
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
          <p>이번 변경은 인증 안정성과 분석 흐름을 보강한 작업입니다. 다음 단계에서는 로그인 유지 실패 상황과 결과 저장 상태를 우선 확인하는 것이 좋습니다.</p>
        </div>
        <button type="button" onClick={() => onNavigate("detail")}>파일 상세 분석 보기</button>
      </section>
    </PageShell>
  );
};

export default ResultSummaryPage;
