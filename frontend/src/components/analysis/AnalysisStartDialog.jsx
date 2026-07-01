import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { createAnalysisRun, getProjects, uploadAnalysisArtifacts } from "../../api";
import { notify } from "@utils/feedback";
import { useMocks } from "@utils/mockConfig";
import commitlensLogo from "@assets/images/commitlens-logo.png";
import "@styles/components/dialog.css";

const steps = ["분석 방식", "대상 선택", "옵션 선택", "시작 확인"];

const analysisOptions = [
  ["summary", "변경 요약", "변경 내용을 읽기 쉬운 요약으로 정리합니다."],
  ["risk", "검토 항목 찾기", "주의해서 확인할 변경을 표시합니다."],
  ["message", "메시지 추천", "상황에 맞는 커밋 메시지를 제안합니다."],
  ["refactor", "개선 포인트", "정리하면 좋은 코드 흐름을 찾아줍니다."],
];

const demoRepositories = [
  { id: "chaehoon/ai-commit-analyzer", owner: "chaehoon", repo: "ai-commit-analyzer", branch: "feature/FE_all" },
  { id: "chaehoon/backend-server", owner: "chaehoon", repo: "backend-server", branch: "develop" },
  { id: "chaehoon/frontend-app", owner: "chaehoon", repo: "frontend-app", branch: "main" },
];

const AnalysisStartDialog = ({ trigger, onStart }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [analysisType, setAnalysisType] = useState("upload");
  const [repositoryOptions, setRepositoryOptions] = useState(useMocks ? demoRepositories : []);
  const [repository, setRepository] = useState(useMocks ? "chaehoon/ai-commit-analyzer" : "");
  const [branch, setBranch] = useState(useMocks ? "feature/FE_all" : "");
  const [range, setRange] = useState("최근 30일");
  const [projectName, setProjectName] = useState(useMocks ? "ai-commit-analyzer" : "");
  const [options, setOptions] = useState(["summary", "risk", "message"]);
  const fileInputRef = useRef(null);

  const selectedOptions = useMemo(() => {
    return analysisOptions.filter(([key]) => options.includes(key));
  }, [options]);

  useEffect(() => {
    if (!open || useMocks) return undefined;

    let mounted = true;

    const loadRepositories = async () => {
      try {
        const projects = await getProjects();
        if (!mounted) return;

        const nextOptions = projects.map((project) => ({
          id: `${project.owner}/${project.repo}`,
          owner: project.owner,
          repo: project.repo,
          branch: project.branch,
        }));
        setRepositoryOptions(nextOptions);
        setRepository((current) => current || nextOptions[0]?.id || "");
        setBranch((current) => current || nextOptions[0]?.branch || "");
      } catch {
        if (mounted) {
          setRepositoryOptions([]);
        }
      }
    };

    loadRepositories();

    return () => {
      mounted = false;
    };
  }, [open]);

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

  const startAnalysis = async () => {
    const loadingId = notify.loading("분석을 시작하고 있습니다.");

    try {
      const payload = {
        type: analysisType,
        repository,
        branch,
        range,
        projectName,
        options,
      };
      const analysisRun = analysisType === "upload"
        ? await uploadAnalysisArtifacts({ ...payload, files: fileInputRef.current?.files })
        : await createAnalysisRun(payload);

      notify.dismiss(loadingId);
      notify.success("분석을 시작합니다.");
      closeDialog(false);
      onStart?.(analysisRun);
    } catch {
      notify.dismiss(loadingId);
      notify.error("분석 시작에 실패했습니다. 입력값과 API 연결 상태를 확인하세요.");
    }
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
                    <select value={repository} onChange={(event) => setRepository(event.target.value)}>
                      {repositoryOptions.length === 0 ? <option value="">연결된 저장소 없음</option> : null}
                      {repositoryOptions.map((item) => (
                        <option key={item.id} value={item.id}>{item.id}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    브랜치
                    <select value={branch} onChange={(event) => setBranch(event.target.value)}>
                      {branch ? <option>{branch}</option> : <option value="">브랜치 없음</option>}
                      <option>main</option>
                      <option>develop</option>
                    </select>
                  </label>
                  <label>
                    분석 범위
                    <select value={range} onChange={(event) => setRange(event.target.value)}>
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
                    <input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="예: sprint-12-auth-review" />
                  </label>
                  <div className="command-help compact">
                    <b>업로드 전 준비할 파일</b>
                    <code>git log --stat --patch &gt; commit-history.patch</code>
                    <code>git diff main...HEAD &gt; changes.diff</code>
                    <code>git diff --name-only main...HEAD &gt; changed-files.txt</code>
                  </div>
                  <label className="upload-box compact">
                    <input multiple ref={fileInputRef} type="file" />
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
