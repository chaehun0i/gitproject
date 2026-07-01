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

const commandGroups = [
  {
    title: "현재 커밋하지 않은 작업 저장",
    commands: [
      "git status --short > changed-files.txt",
      "git diff > working-changes.diff",
      "git diff --staged > staged-changes.diff",
    ],
  },
  {
    title: "브랜치에 이미 커밋된 변경 저장",
    commands: [
      "git fetch origin",
      "git log --reverse --stat --patch origin/main..HEAD > commit-history.patch",
      "git diff origin/main...HEAD > branch-changes.diff",
      "git diff --name-status origin/main...HEAD > branch-changed-files.txt",
    ],
  },
  {
    title: "커밋된 변경과 현재 작업까지 함께 저장",
    commands: [
      "git fetch origin",
      "git log --reverse --stat --patch origin/main..HEAD > commit-history.patch",
      "git diff origin/main > all-current-changes.diff",
      "git diff --name-status origin/main > all-current-changed-files.txt",
      "git status --short > working-status.txt",
    ],
  },
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const selectedOptions = useMemo(() => {
    return analysisOptions.filter(([key]) => options.includes(key));
  }, [options]);

  const validationMessage = useMemo(() => {
    if (analysisType === "github") {
      if (!repository) return "분석할 저장소를 선택하세요.";
      if (!branch) return "분석할 브랜치를 선택하세요.";
      return "";
    }
    if (!projectName.trim()) return "업로드 분석에 사용할 프로젝트 이름을 입력하세요.";
    if (selectedFiles.length === 0) return "분석할 Git 산출물 파일을 선택하세요.";
    return "";
  }, [analysisType, branch, projectName, repository, selectedFiles.length]);

  const canSubmit = !validationMessage && options.length > 0 && !isSubmitting;

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
        if (mounted) setRepositoryOptions([]);
      }
    };

    loadRepositories();

    return () => {
      mounted = false;
    };
  }, [open]);

  const closeDialog = (nextOpen) => {
    if (isSubmitting) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep(1);
      setIsDragging(false);
    }
  };

  const toggleOption = (key) => {
    setOptions((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ));
  };

  const syncFiles = (files) => {
    setSelectedFiles(Array.from(files ?? []));
  };

  const startAnalysis = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

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
        ? await uploadAnalysisArtifacts({ ...payload, files: selectedFiles })
        : await createAnalysisRun(payload);

      notify.success("분석을 생성했습니다.");
      closeDialog(false);
      onStart?.(analysisRun);
    } catch {
      notify.error("분석 생성에 실패했습니다. 입력값과 API 연결 상태를 확인하세요.");
    } finally {
      setIsSubmitting(false);
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
                <Dialog.Description>저장소 연결 또는 Git 산출물 업로드 방식으로 분석을 생성합니다.</Dialog.Description>
              </div>
            </div>
            <Dialog.Close aria-label="닫기" disabled={isSubmitting}>×</Dialog.Close>
          </div>

          <div className="analysis-stepper" aria-label="분석 시작 단계">
            {steps.map((label, index) => (
              <span className={step === index + 1 ? "active" : ""} key={label}>
                {index + 1}. {label}
              </span>
            ))}
          </div>

          <div className="analysis-dialog-body">
            {step === 1 ? (
              <section className="dialog-section">
                <div className="dialog-section-title">
                  <span>입력 방식</span>
                  <p>분석할 소스가 저장소인지, 로컬에서 만든 Git 산출물인지 선택하세요.</p>
                </div>
                <div className="analysis-type-grid">
                  <button
                    className={analysisType === "github" ? "analysis-type-card active" : "analysis-type-card"}
                    type="button"
                    onClick={() => setAnalysisType("github")}
                  >
                    <b>GitHub 저장소 분석</b>
                    <small>연결된 프로젝트와 브랜치를 기준으로 변경 내용을 분석합니다.</small>
                  </button>
                  <button
                    className={analysisType === "upload" ? "analysis-type-card active" : "analysis-type-card"}
                    type="button"
                    onClick={() => setAnalysisType("upload")}
                  >
                    <b>Git 산출물 업로드 분석</b>
                    <small>diff, patch, log, zip 파일을 업로드해 분석합니다.</small>
                  </button>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="dialog-section">
                <div className="dialog-section-title">
                  <span>{analysisType === "github" ? "저장소 정보" : "업로드 정보"}</span>
                  <p>{analysisType === "github" ? "저장소와 브랜치는 필수입니다." : "프로젝트 이름과 파일은 필수입니다."}</p>
                </div>

                {analysisType === "github" ? (
                  <div className="dialog-form compact-form">
                    <label className="required-field">
                      저장소
                      <select value={repository} onChange={(event) => {
                        const nextRepository = event.target.value;
                        const selected = repositoryOptions.find((item) => item.id === nextRepository);
                        setRepository(nextRepository);
                        setBranch(selected?.branch || branch);
                      }}>
                        {repositoryOptions.length === 0 ? <option value="">연결된 저장소 없음</option> : null}
                        {repositoryOptions.map((item) => (
                          <option key={item.id} value={item.id}>{item.id}</option>
                        ))}
                      </select>
                    </label>
                    <label className="required-field">
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
                  </div>
                ) : (
                  <div className="dialog-form compact-form">
                    <label className="required-field">
                      프로젝트 이름
                      <input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="예: sprint-12-auth-review" />
                    </label>
                    <div className="command-help compact">
                      <b>Git 산출물 생성 가이드</b>
                      {commandGroups.map((group) => (
                        <div className="command-group" key={group.title}>
                          <span>{group.title}</span>
                          {group.commands.map((command) => <code key={command}>{command}</code>)}
                        </div>
                      ))}
                      <small>
                        base 브랜치가 main이 아니면 origin/main을 실제 base 브랜치로 바꾸세요.
                        `git diff origin/main...HEAD`는 base 이후 커밋 변경만, `git diff origin/main`은 현재 작업트리 변경까지 포함합니다.
                      </small>
                    </div>
                    <label
                      className={isDragging ? "upload-box compact dragging required-field" : "upload-box compact required-field"}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        syncFiles(event.dataTransfer.files);
                      }}
                    >
                      <input multiple ref={fileInputRef} type="file" onChange={(event) => syncFiles(event.target.files)} />
                      <strong>분석 파일 업로드</strong>
                      <small>patch, diff, txt, zip 파일을 선택하거나 끌어오세요.</small>
                      <em>{selectedFiles.length > 0 ? `${selectedFiles.length}개 파일 선택됨` : "선택된 파일 없음"}</em>
                    </label>
                    {selectedFiles.length > 0 ? (
                      <div className="selected-file-list">
                        {selectedFiles.map((file) => <span key={`${file.name}-${file.size}`}>{file.name}</span>)}
                      </div>
                    ) : null}
                  </div>
                )}
                {validationMessage ? <p className="inline-validation">{validationMessage}</p> : null}
              </section>
            ) : null}

            {step === 3 ? (
              <section className="dialog-section">
                <div className="dialog-section-title">
                  <span>분석 옵션</span>
                  <p>결과 화면에 생성할 분석 항목을 선택하세요.</p>
                </div>
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
                {options.length === 0 ? <p className="inline-validation">하나 이상의 분석 옵션을 선택하세요.</p> : null}
              </section>
            ) : null}

            {step === 4 ? (
              <section className="dialog-summary-card">
                <span>{analysisType === "github" ? "GitHub 저장소 분석" : "Git 산출물 업로드 분석"}</span>
                <h3>선택한 설정으로 분석을 시작할까요?</h3>
                <p>분석을 생성하면 진행 상태 화면에서 현재 단계를 확인할 수 있습니다.</p>
                <div>
                  {selectedOptions.map(([, title]) => <em key={title}>{title}</em>)}
                </div>
                {analysisType === "upload" ? <small>{selectedFiles.length}개 파일을 업로드합니다.</small> : <small>{repository} · {branch}</small>}
                {validationMessage || options.length === 0 ? (
                  <p className="inline-validation">{validationMessage || "하나 이상의 분석 옵션을 선택하세요."}</p>
                ) : null}
              </section>
            ) : null}
          </div>

          <div className="dialog-actions space-between">
            <button className="outline-action" disabled={isSubmitting} type="button" onClick={() => (step === 1 ? closeDialog(false) : setStep(step - 1))}>
              {step === 1 ? "취소" : "이전"}
            </button>
            {step < 4 ? (
              <button className="primary-action" disabled={isSubmitting || (step === 2 && Boolean(validationMessage))} type="button" onClick={() => setStep(step + 1)}>다음</button>
            ) : (
              <button className="primary-action" disabled={!canSubmit} type="button" onClick={startAnalysis}>
                {isSubmitting ? "분석 생성 중..." : "분석 시작"}
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AnalysisStartDialog;
