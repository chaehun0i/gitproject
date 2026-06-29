import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { notify } from "@utils/feedback";
import TermsDialog from "@components/analysis/TermsDialog";
import "@styles/components/dialog.css";

const AnalysisStartDialog = ({ trigger, onStart }) => {
  const [analysisType, setAnalysisType] = useState("gitFiles");
  const [termsOpen, setTermsOpen] = useState(false);

  const requestStart = () => {
    setTermsOpen(true);
  };

  const agreeAndStart = () => {
    setTermsOpen(false);
    const label = analysisType === "gitFiles" ? "Git 산출물 업로드" : "GitHub 연동";
    notify.success(`${label} 분석을 시작합니다.`);
    onStart?.(analysisType);
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content analysis-dialog">
            <div className="dialog-head">
              <Dialog.Title>새 분석 만들기</Dialog.Title>
              <Dialog.Close aria-label="닫기">x</Dialog.Close>
            </div>

            <div className="analysis-tabs" role="tablist" aria-label="분석 방식">
              <button
                className={analysisType === "gitFiles" ? "active" : ""}
                type="button"
                onClick={() => setAnalysisType("gitFiles")}
              >
                Git 산출물 업로드
              </button>
              <button
                className={analysisType === "github" ? "active" : ""}
                type="button"
                onClick={() => setAnalysisType("github")}
              >
                GitHub 연동 분석
              </button>
            </div>

            {analysisType === "gitFiles" ? (
              <div className="dialog-form">
                <label>
                  프로젝트 이름
                  <input placeholder="예: sprint-12-review" />
                </label>
                <div className="command-help">
                  <b>업로드 권장 산출물</b>
                  <code>git log --stat --patch &gt; commit-history.patch</code>
                  <code>git diff main...HEAD &gt; changes.diff</code>
                  <code>git diff --name-only main...HEAD &gt; changed-files.txt</code>
                </div>
                <label className="upload-box">
                  <input multiple type="file" />
                  <strong>Git 명령어 산출물을 업로드하세요</strong>
                  <small>patch, diff, txt, zip 파일을 여러 개 선택할 수 있습니다.</small>
                </label>
                <label>
                  분석 메모
                  <textarea placeholder="브랜치명, 기준 커밋, 확인하고 싶은 위험 요소를 적어주세요." />
                </label>
              </div>
            ) : (
              <div className="dialog-form">
                <label>
                  GitHub 저장소
                  <select>
                    <option>ai-commit-analyzer</option>
                    <option>backend-server</option>
                    <option>frontend-app</option>
                  </select>
                </label>
                <label>
                  브랜치
                  <select>
                    <option>main</option>
                    <option>develop</option>
                    <option>feature/refactor</option>
                  </select>
                </label>
                <label>
                  분석 범위
                  <select>
                    <option>최근 30일</option>
                    <option>최근 7일</option>
                    <option>특정 커밋 범위</option>
                  </select>
                </label>
              </div>
            )}

            <div className="dialog-actions">
              <Dialog.Close asChild>
                <button className="outline-action" type="button">취소</button>
              </Dialog.Close>
              <button className="primary-action" type="button" onClick={requestStart}>
                약관 확인 후 시작
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} onAgree={agreeAndStart} />
    </>
  );
};

export default AnalysisStartDialog;
