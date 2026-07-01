import { useEffect, useMemo, useState } from "react";
import { PipelineVisual } from "@components/common/ProductVisuals";
import PageShell from "@pages/PageShell";
import { getAnalysisProgress } from "../api";
import { useMocks } from "@utils/mockConfig";
import "@styles/pages/pageCommon.css";
import "@styles/pages/analysisProgressPage.css";

const steps = [
  ["collect", "커밋 수집", "연결된 저장소 또는 업로드 파일에서 변경 기록을 모읍니다."],
  ["diff", "변경 파일 분석", "파일별 변경 내용을 정리합니다."],
  ["understand", "코드 변경 이해", "파일별 변경 의도와 영향 범위를 분류합니다."],
  ["summary", "AI 요약 생성", "주요 변경 사항과 위험 포인트를 요약합니다."],
  ["message", "커밋 메시지 제안", "Conventional Commit 후보를 생성합니다."],
];

const logs = [
  "분석 작업이 시작되었습니다.",
  "커밋 기록 정리가 완료되었습니다.",
  "변경 파일 42개를 확인했습니다.",
  "인증 흐름 변경 요약을 생성 중입니다.",
  "분석 결과를 저장할 준비를 하고 있습니다.",
];

const AnalysisProgressPage = ({ currentPage, onNavigate }) => {
  const [progress, setProgress] = useState(useMocks ? 65 : 0);
  const [runtimeLogs, setRuntimeLogs] = useState(useMocks ? logs : []);
  const [counters, setCounters] = useState(useMocks ? { commits: 128, files: 42, risks: 8, messages: 3 } : { commits: 0, files: 0, risks: 0, messages: 0 });

  useEffect(() => {
    let mounted = true;

    const loadProgress = async () => {
      try {
        const data = await getAnalysisProgress();
        if (mounted) {
          setProgress(data.progress ?? (useMocks ? 65 : 0));
          setRuntimeLogs(data.logs ?? []);
          setCounters(data.counters ?? { commits: 0, files: 0, risks: 0, messages: 0 });
        }
      } catch {
        if (mounted) {
          setRuntimeLogs(["분석 진행 상태를 불러오지 못했습니다."]);
        }
      }
    };

    loadProgress();

    const timer = window.setInterval(() => {
      if (useMocks) {
        setProgress((value) => (value >= 72 ? 65 : value + 1));
        return;
      }
      loadProgress();
    }, useMocks ? 900 : 3000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const activeIndex = useMemo(() => {
    if (progress >= 90) return 4;
    if (progress >= 70) return 3;
    if (progress >= 50) return 2;
    if (progress >= 25) return 1;
    return 0;
  }, [progress]);

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="분석 진행 상태"
      description="분석 진행률과 현재 처리 단계를 확인합니다."
    >
      <section className="progress-hero page-card">
        <div>
          <span className="recommend-badge">실시간 진행 중</span>
          <h2>AI가 변경 내용을 분석 중입니다</h2>
          <p>
            커밋 수집부터 요약 생성까지 단계별 진행 상태를 보여주는 화면입니다.
            분석이 완료되면 결과 요약 화면에서 주요 변경 내용을 확인할 수 있습니다.
          </p>
          <div className="progress-bar large">
            <span style={{ "--score": `${progress}%` }} />
          </div>
          <div className="progress-meta">
            <b>{progress}%</b>
            <span>남은 예상 시간 1분 20초</span>
          </div>
        </div>
        <PipelineVisual />
      </section>

      <section className="progress-layout">
        <article className="page-card progress-steps-card">
          <div className="panel-title">
            <h2>분석 단계</h2>
            <button type="button" onClick={() => onNavigate("result")}>결과 미리보기</button>
          </div>
          {steps.map(([key, title, text], index) => {
            const status = index < activeIndex ? "done" : index === activeIndex ? "active" : "wait";
            return (
              <div className={`progress-step ${status}`} key={key}>
                <span>{index < activeIndex ? "✓" : index === activeIndex ? "•" : index + 1}</span>
                <div>
                  <b>{title}</b>
                  <p>{text}</p>
                </div>
                <em>{index < activeIndex ? "완료" : index === activeIndex ? "진행 중" : "대기"}</em>
              </div>
            );
          })}
        </article>

        <aside className="analysis-side-stack">
          <article className="page-card live-console-card">
            <h2>실시간 로그</h2>
            <div className="live-console">
              {runtimeLogs.map((line) => <code key={line}>{line}</code>)}
            </div>
          </article>
          <article className="page-card">
            <h2>현재 처리 데이터</h2>
            <div className="summary-points">
              <span><b>{counters.commits}</b> 커밋 수집</span>
              <span><b>{counters.files}</b> 변경 파일 분석</span>
              <span><b>{counters.risks}</b> 위험 포인트 후보</span>
              <span><b>{counters.messages}</b> 커밋 메시지 후보</span>
            </div>
            <button type="button" onClick={() => onNavigate("result")}>완료 화면 보기</button>
          </article>
        </aside>
      </section>
    </PageShell>
  );
};

export default AnalysisProgressPage;
