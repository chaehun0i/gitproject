import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";
import { notify } from "@utils/feedback";
import commitlensLogo from "@assets/images/commitlens-logo.png";
import "@styles/components/dialog.css";

const steps = ["분석 방식", "대상 선택", "옵션 선택", "시작 확인"];

const analysisOptions = [
  ["summary", "변경 요약", "변경 내용을 읽기 쉬운 요약으로 정리합니다."],
  ["risk", "검토 항목 찾기", "주의해서 확인할 변경을 표시합니다."],
  ["message", "메시지 추천", "상황에 맞는 커밋 메시지를 제안합니다."],
  ["refactor", "개선 포인트", "정리하면 좋은 코드 흐름을 찾아줍니다."],
];

const AnalysisStartDialog = ({ trigger, onStart }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [analysisType, setAnalysisType] = useState("upload");
  const [options, setOptions] = useState(["summary", "risk", "message"]);

  const selectedOptions = useMemo(() => {
    return analysisOptions.filter(([key]) => options.includes(key));
  }, [options]);

  const closeDialog = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep(1);
    }
  };

  const toggleOption = (key) => {
    setOptions((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ));
  };

  const startAnalysis = () => {
    notify.success("분석을 시작합니다.");
    closeDialog(false);
    onStart?.(analysisType);
  };

  return (
    <Dialog.Root open={open} onOpenChange={closeDialog}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content analysis-dialog">
          <div className="dialog-head">
            <div className="dialog-title-block">
              <img alt="CommitLens" src={commitlensLogo} />
              <div>
                <Dialog.Title>새 분석 시작</Dialog.Title>
                <Dialog.Description>분석할 방식과 범위를 차례로 선택합니다.</Dialog.Description>
              </div>
            </div>
            <Dialog.Close aria-label="닫기">×</Dialog.Close>
          </div>

          <div className="analysis-stepper" aria-label="분석 시작 단계">
            {steps.map((label, index) => (
              <span className={step === index + 1 ? "active" : ""} key={label}>
                {index + 1}. {label}
              </span>
            ))}
          </div>

          {step === 1 ? (
            <div className="analysis-type-grid">
              <button
                className={analysisType === "github" ? "analysis-type-card active" : "analysis-type-card"}
                type="button"
                onClick={() => setAnalysisType("github")}
              >
                <b>GitHub 저장소 분석</b>
                <small>연결된 저장소와 브랜치를 선택해 최근 변경을 분석합니다.</small>
              </button>
              <button
                className={analysisType === "upload" ? "analysis-type-card active" : "analysis-type-card"}
                type="button"
                onClick={() => setAnalysisType("upload")}
              >
                <b>Git 산출물 업로드 분석</b>
                <small>직접 저장한 diff, log, patch 파일을 업로드해 분석합니다.</small>
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="dialog-form compact-form">
              {analysisType === "github" ? (
                <>
                  <label>
                    저장소
                    <select defaultValue="chaehoon/ai-commit-analyzer">
                      <option>chaehoon/ai-commit-analyzer</option>
                      <option>chaehoon/backend-server</option>
                      <option>chaehoon/frontend-app</option>
                    </select>
                  </label>
                  <label>
                    브랜치
                    <select defaultValue="feature/FE_all">
                      <option>feature/FE_all</option>
                      <option>main</option>
                      <option>develop</option>
                    </select>
                  </label>
                  <label>
                    분석 범위
                    <select defaultValue="최근 30일">
                      <option>최근 7일</option>
                      <option>최근 30일</option>
                      <option>최근 90일</option>
                      <option>직접 선택</option>
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label>
                    프로젝트 이름
                    <input placeholder="예: sprint-12-auth-review" />
                  </label>
                  <div className="command-help compact">
                    <b>업로드 전 준비할 파일</b>
                    <code>git log --stat --patch &gt; commit-history.patch</code>
                    <code>git diff main...HEAD &gt; changes.diff</code>
                    <code>git diff --name-only main...HEAD &gt; changed-files.txt</code>
                  </div>
                  <label className="upload-box compact">
                    <input multiple type="file" />
                    <strong>분석 파일 업로드</strong>
                    <small>patch, diff, txt, zip 파일을 선택할 수 있습니다.</small>
                  </label>
                </>
              )}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="compact-check-list">
              {analysisOptions.map(([key, title, text]) => (
                <label className="compact-check-row" key={key}>
                  <input checked={options.includes(key)} type="checkbox" onChange={() => toggleOption(key)} />
                  <span>
                    <b>{title}</b>
                    <small>{text}</small>
                  </span>
                </label>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="dialog-summary-card">
              <span>{analysisType === "github" ? "GitHub 저장소 분석" : "Git 산출물 업로드 분석"}</span>
              <h3>선택한 설정으로 분석을 시작할까요?</h3>
              <p>분석이 시작되면 진행 상태 창에서 현재 단계를 확인할 수 있습니다.</p>
              <div>
                {selectedOptions.map(([, title]) => <em key={title}>{title}</em>)}
              </div>
            </div>
          ) : null}

          <div className="dialog-actions space-between">
            <button className="outline-action" type="button" onClick={() => (step === 1 ? closeDialog(false) : setStep(step - 1))}>
              {step === 1 ? "취소" : "이전"}
            </button>
            {step < 4 ? (
              <button className="primary-action" type="button" onClick={() => setStep(step + 1)}>다음</button>
            ) : (
              <button className="primary-action" type="button" onClick={startAnalysis}>분석 시작</button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AnalysisStartDialog;
