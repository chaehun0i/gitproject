import { useEffect, useMemo, useState } from "react";
import { PipelineVisual } from "@components/common/ProductVisuals";
import PageShell from "@pages/PageShell";

const steps = [
  ["collect", "커밋 수집", "GitHub API 또는 업로드 파일에서 커밋 로그를 수집합니다."],
  ["diff", "변경 파일 분석", "diff, patch, changed-files 산출물을 파싱합니다."],
  ["understand", "코드 변경 이해", "파일별 변경 의도와 영향 범위를 분류합니다."],
  ["summary", "AI 요약 생성", "주요 변경 사항과 위험 포인트를 요약합니다."],
  ["message", "커밋 메시지 제안", "Conventional Commit 후보를 생성합니다."],
];

const logs = [
  "[WebSocket] analysis:run:15 연결됨",
  "[Git Parser] commit-history.patch 파싱 완료",
  "[Diff Parser] 변경 파일 42개 감지",
  "[AI Analyzer] 인증 흐름 변경 요약 생성 중",
  "[DB] analysis_files, ai_findings 저장 대기",
];

const AnalysisProgressPage = ({ currentPage, onNavigate }) => {
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => (value >= 72 ? 65 : value + 1));
    }, 900);

    return () => window.clearInterval(timer);
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
      description="WebSocket 기반 진행률과 백엔드 분석 파이프라인 상태를 확인합니다."
    >
      <section className="progress-hero page-card">
        <div>
          <span className="recommend-badge">WebSocket Connected</span>
          <h2>AI가 변경 내용을 분석 중입니다</h2>
          <p>
            커밋 수집부터 AI 요약 생성까지 단계별 진행 상태를 실시간으로 보여주는 화면입니다.
            실제 백엔드 연결 전에는 mock 진행률로 동작합니다.
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
              {logs.map((line) => <code key={line}>{line}</code>)}
            </div>
          </article>
          <article className="page-card">
            <h2>현재 처리 데이터</h2>
            <div className="summary-points">
              <span><b>128</b> 커밋 수집</span>
              <span><b>42</b> 변경 파일 분석</span>
              <span><b>8</b> 위험 포인트 후보</span>
              <span><b>3</b> 커밋 메시지 후보</span>
            </div>
            <button type="button" onClick={() => onNavigate("result")}>완료 화면 보기</button>
          </article>
        </aside>
      </section>
    </PageShell>
  );
};

export default AnalysisProgressPage;
