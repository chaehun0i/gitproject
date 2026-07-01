import axios from "axios";
import { useMocks } from "@utils/mockConfig";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  timeout: 10000,
  withCredentials: true,
});

const ACCESS_TOKEN_KEY = "commitlens.accessToken";
const REFRESH_TOKEN_KEY = "commitlens.refreshToken";

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const persistAuthTokens = (data) => {
  if (data?.accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  if (data?.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
};

const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const demoUser = {
  id: "demo-user",
  name: "이채훈",
  email: "chaehoon@example.com",
  role: "개발자",
  githubUsername: "hongdev",
  joinedAt: "2026.06.15",
  lastLoginAt: "2026.06.21 14:30",
};

const demoCredentials = {
  email: "chaehoon@example.com",
  password: "demo1234",
};

const assertUser = (user) => {
  if (!user) {
    throw new Error("인증 응답에 사용자 정보가 없습니다.");
  }
  return user;
};

const demoProjects = [
  {
    id: "ai-commit-analyzer",
    name: "ai-commit-analyzer",
    owner: "chaehoon",
    repo: "ai-commit-analyzer",
    source: "Git 산출물",
    visibility: "private",
    branch: "feature/FE_all",
    language: "React",
    updated: "2시간 전",
    status: "분석 완료",
    commits: "1,248",
    files: "842",
    insights: "28",
    progress: 100,
    starred: true,
  },
  {
    id: "backend-server",
    name: "backend-server",
    owner: "chaehoon",
    repo: "backend-server",
    source: "GitHub",
    visibility: "private",
    branch: "develop",
    language: "FastAPI",
    updated: "5시간 전",
    status: "분석 완료",
    commits: "562",
    files: "413",
    insights: "16",
    progress: 100,
    starred: false,
  },
  {
    id: "frontend-app",
    name: "frontend-app",
    owner: "chaehoon",
    repo: "frontend-app",
    source: "GitHub",
    visibility: "private",
    branch: "main",
    language: "React",
    updated: "1일 전",
    status: "분석 중",
    commits: "1,102",
    files: "724",
    insights: "-",
    progress: 68,
    starred: false,
  },
  {
    id: "docs",
    name: "docs",
    owner: "chaehoon",
    repo: "docs",
    source: "Git 산출물",
    visibility: "public",
    branch: "main",
    language: "Markdown",
    updated: "3일 전",
    status: "분석 대기",
    commits: "-",
    files: "-",
    insights: "-",
    progress: 0,
    starred: false,
  },
  {
    id: "utils-library",
    name: "utils-library",
    owner: "chaehoon",
    repo: "utils-library",
    source: "GitHub",
    visibility: "private",
    branch: "feature/refactor",
    language: "Python",
    updated: "1주 전",
    status: "분석 완료",
    commits: "342",
    files: "219",
    insights: "12",
    progress: 100,
    starred: false,
  },
  {
    id: "mobile-client",
    name: "mobile-client",
    owner: "chaehoon",
    repo: "mobile-client",
    source: "GitHub",
    visibility: "private",
    branch: "release",
    language: "React Native",
    updated: "2주 전",
    status: "분석 완료",
    commits: "214",
    files: "96",
    insights: "9",
    progress: 100,
    starred: false,
  },
  {
    id: "admin-console",
    name: "admin-console",
    owner: "chaehoon",
    repo: "admin-console",
    source: "Git 산출물",
    visibility: "private",
    branch: "main",
    language: "React",
    updated: "3주 전",
    status: "분석 대기",
    commits: "-",
    files: "-",
    insights: "-",
    progress: 0,
    starred: false,
  },
];

const demoWorkspace = {
  kpis: [
    ["총 프로젝트", "5", "GitHub 3 · 업로드 2"],
    ["총 분석 수", "42", "이번 주 8건"],
    ["분석 커밋", "1,248", "지난 30일 기준"],
    ["절약된 시간", "70h", "리뷰/메시지 작성"],
    ["AI 제안 수락률", "92%", "팀 적용 기준"],
  ],
  recentProjects: [
    ["ai-commit-analyzer", "파일 업로드", "feature/FE_all", "분석 완료", "2시간 전", 92],
    ["backend-server", "저장소 연결", "develop", "분석 완료", "5시간 전", 86],
    ["frontend-app", "저장소 연결", "main", "분석 중", "1시간 전", 68],
    ["docs", "파일 업로드", "main", "대기 중", "3시간 전", 0],
  ],
  insights: [
    ["검토할 변경", "로그인 유지와 화면 구성 변경은 먼저 확인하면 좋습니다."],
    ["정리된 변경", "최근 작업은 인증 화면과 분석 화면 개선에 집중되어 있습니다."],
    ["추천 메시지", "변경 흐름에 맞는 커밋 메시지 후보가 준비되었습니다."],
  ],
  chartValues: [28, 42, 36, 58, 49, 72, 64, 88, 73, 95, 69, 82],
};

const demoHistory = [
  { project: "ai-commit-analyzer", branch: "feature/FE_all", source: "Git 산출물", status: "분석 완료", commits: "128", files: "42", runtime: "3분 12초", createdAt: "2026.06.30" },
  { project: "backend-server", branch: "develop", source: "GitHub", status: "분석 완료", commits: "86", files: "31", runtime: "2분 44초", createdAt: "2026.06.29" },
  { project: "frontend-app", branch: "main", source: "GitHub", status: "분석 중", commits: "104", files: "28", runtime: "진행 중", createdAt: "2026.06.28" },
  { project: "docs", branch: "main", source: "Git 산출물", status: "분석 대기", commits: "-", files: "-", runtime: "-", createdAt: "2026.06.27" },
  { project: "utils-library", branch: "feature/refactor", source: "GitHub", status: "분석 완료", commits: "52", files: "18", runtime: "1분 50초", createdAt: "2026.06.26" },
  { project: "mobile-client", branch: "release", source: "GitHub", status: "분석 완료", commits: "64", files: "22", runtime: "2분 10초", createdAt: "2026.06.25" },
  { project: "admin-console", branch: "main", source: "Git 산출물", status: "분석 대기", commits: "-", files: "-", runtime: "-", createdAt: "2026.06.24" },
];

const demoSummary = {
  projectName: "ai-commit-analyzer",
  metrics: [
    ["분석 커밋", "128", "변경 기록 기준"],
    ["변경 파일", "42", "파일 변경 기준"],
    ["추가 라인", "+2,345", "기능 영역 집중"],
    ["삭제 라인", "-1,234", "중복 로직 제거"],
    ["위험 포인트", "8", "AI 리뷰 필요"],
  ],
  changeTypes: [
    { name: "기능 추가", value: 40 },
    { name: "버그 수정", value: 28 },
    { name: "리팩토링", value: 20 },
    { name: "문서/기타", value: 12 },
  ],
  activityValues: [32, 58, 44, 71, 49, 82, 65, 92, 56, 74],
  reviewPoints: [
    "refresh API 실패 시 UX 메시지와 로그아웃 처리 확인",
    "로그인 유지 실패 시 사용자 안내 흐름 검토",
    "분석 기록의 완료 상태와 재조회 흐름 확인",
    "인증 변경 구간에 대한 e2e 테스트 보강",
  ],
};

const demoMessages = [
  {
    text: "feat(auth): 로그인 세션 refresh 플로우 추가",
    type: "feat",
    scope: "auth",
    reason: "새로고침 후에도 로그인 상태를 유지하는 흐름이 추가되었습니다.",
  },
  {
    text: "fix(auth): refresh 실패 시 인증 상태 복구 처리 개선",
    type: "fix",
    scope: "auth",
    reason: "refresh API 실패 시 프론트 상태와 UX 메시지를 정리한 변경입니다.",
  },
  {
    text: "refactor(api): 인증 API 호출 구조 정리",
    type: "refactor",
    scope: "api",
    reason: "로그인, 로그아웃, 세션 복구 API 호출 경계를 분리했습니다.",
  },
  {
    text: "docs(db): 분석 결과 저장 테이블 구조 문서화",
    type: "docs",
    scope: "db",
    reason: "analysis_runs, analysis_files, ai_findings 저장 구조가 추가되었습니다.",
  },
  {
    text: "test(auth): 로그인 유지 흐름 검증 추가",
    type: "test",
    scope: "auth",
    reason: "로그인 유지와 새로고침 복구 흐름을 테스트로 확인하는 작업입니다.",
  },
  {
    text: "chore(ui): 분석 화면 버튼 스타일 정리",
    type: "chore",
    scope: "ui",
    reason: "분석 흐름에서 반복되는 버튼 스타일을 같은 톤으로 맞춘 작업입니다.",
  },
];

const demoDetail = {
  files: [
    ["src/api/auth/login.ts", "TypeScript", "수정", "+45", "-23", "높음"],
    ["src/utils/tokenset.py", "Python", "수정", "+28", "-8", "중간"],
    ["src/styles/pages/auth.css", "CSS", "수정", "+92", "-31", "낮음"],
    ["backend/src/utils/rediscl.py", "Python", "추가", "+64", "-0", "중간"],
    ["src/pages/HomePage.jsx", "React", "수정", "+38", "-14", "낮음"],
    ["src/components/analysis/AnalysisStartDialog.jsx", "React", "수정", "+72", "-19", "중간"],
    ["src/styles/pages/detailAnalysisPage.css", "CSS", "수정", "+116", "-22", "낮음"],
    ["src/stores/slices/authSlice.js", "JavaScript", "수정", "+31", "-9", "중간"],
  ],
  diffLines: [
    ["ctx", "export const login = async (email, password) => {"],
    ["del", "  const token = await api.post('/auth/login', { email, password });"],
    ["del", "  localStorage.setItem('token', token);"],
    ["add", "  const response = await api.post('/auth/login', { email, password });"],
    ["add", "  await refreshSession();"],
    ["add", "  return response.data.user;"],
    ["ctx", "};"],
  ],
  analysisPoints: [
    ["로그인 유지", "새로고침 후 refresh API로 세션을 복구하는 흐름이 추가되었습니다."],
    ["상태 복구", "사용자 식별 정보와 로그인 유지 상태를 분리해 관리하는 흐름입니다."],
    ["분석 기록", "프로젝트, 파일, 커밋, 요약 결과를 다시 확인하기 좋은 구조로 정리됩니다."],
    ["위험 요소", "refresh 실패 시 UX 메시지와 강제 로그아웃 처리가 필요합니다."],
  ],
  commits: [
    "feat(auth): 로그인 세션 refresh 플로우 추가",
    "fix(auth): 새로고침 후 인증 상태 복구 실패 수정",
    "refactor(api): 인증 API 호출 구조 정리",
  ],
  issues: [
    ["AUTH-12", "로그인 유지 만료 시 화면 상태 처리 검증"],
    ["API-08", "refresh 응답 스키마 통일"],
    ["TEST-21", "로그인 유지 e2e 테스트 추가"],
  ],
};

const demoSettings = {
  profile: demoUser,
  integrations: [
    { key: "github", title: "GitHub", value: "hongdev", status: "연결됨" },
    { key: "upload", title: "Git 산출물", value: "활성화됨", status: "사용 가능" },
    { key: "notice", title: "알림", value: "활성화됨", status: "활성" },
  ],
  notifications: {
    analysisDone: true,
    issueDetected: true,
    productNews: true,
    weeklyReport: false,
  },
};

const unwrap = (response, key, fallback) => {
  const data = response.data;
  if (key && data?.[key] !== undefined) return data[key];
  return data ?? fallback;
};

export const loginUser = async ({ email, password, name }) => {
  if (useMocks) {
    if (email === demoCredentials.email && password === demoCredentials.password) {
      return { ...demoUser, name: name || demoUser.name, email };
    }
    throw new Error("데모 계정 정보가 일치하지 않습니다.");
  }
  const response = await api.post("/auth/login", { email, password, name });
  persistAuthTokens(response.data);
  return assertUser(unwrap(response, "user", null));
};

export const signupUser = async ({ email, password, name }) => {
  if (useMocks) return { ...demoUser, name: name || demoUser.name, email: email || demoUser.email };
  const response = await api.post("/auth/signup", { email, password, name });
  persistAuthTokens(response.data);
  return assertUser(unwrap(response, "user", null));
};

export const getCurrentUser = async () => {
  if (useMocks) return demoUser;
  const response = await api.get("/auth/me");
  return unwrap(response, "user", null);
};

export const refreshSession = async () => {
  if (useMocks) return null;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const response = await api.post("/auth/refresh", { refreshToken });
  persistAuthTokens(response.data);
  return unwrap(response, "user", null);
};

export const logoutUser = async () => {
  if (useMocks) return;
  await api.post("/auth/logout", { refreshToken: getRefreshToken() });
  clearAuthTokens();
};

export const getWorkspace = async () => {
  if (useMocks) return demoWorkspace;
  const response = await api.get("/workspace");
  return unwrap(response, "workspace", null);
};

export const getProjects = async (params = {}) => {
  if (useMocks) return demoProjects;
  const response = await api.get("/projects", { params });
  return unwrap(response, "projects", []);
};

export const removeProject = async (projectId) => {
  if (useMocks) return { ok: true };
  const response = await api.delete(`/projects/${projectId}`);
  return unwrap(response, null, { ok: true });
};

export const createAnalysisRun = async (payload) => {
  if (useMocks) return { id: "demo-run", status: "started", ...payload };
  const response = await api.post("/analysis/runs", payload);
  return unwrap(response, "analysisRun", response.data);
};

export const uploadAnalysisArtifacts = async ({ files, ...payload }) => {
  if (useMocks) return { id: "demo-run", status: "started", ...payload };

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
  });
  Array.from(files ?? []).forEach((file) => formData.append("files", file));

  const response = await api.post("/analysis/runs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(response, "analysisRun", response.data);
};

export const getAnalysisProgress = async (analysisRunId = "latest") => {
  if (useMocks) {
    return {
      id: "demo-run",
      progress: 65,
      activeStep: "summary",
      logs: [
        "분석 작업이 시작되었습니다.",
        "커밋 기록 정리가 완료되었습니다.",
        "변경 파일 42개를 확인했습니다.",
        "인증 흐름 변경 요약을 생성 중입니다.",
      ],
      counters: { commits: 128, files: 42, risks: 8, messages: 3 },
    };
  }
  const response = await api.get(`/analysis/runs/${analysisRunId}/progress`);
  return unwrap(response, "progress", response.data);
};

export const getAnalysisSummary = async (analysisRunId = "latest") => {
  if (useMocks) return demoSummary;
  const response = await api.get(`/analysis/runs/${analysisRunId}/summary`);
  return unwrap(response, "summary", { metrics: [], changeTypes: [], activityValues: [], reviewPoints: [] });
};

export const getAnalysisDetail = async (analysisRunId = "latest") => {
  if (useMocks) return demoDetail;
  const response = await api.get(`/analysis/runs/${analysisRunId}/detail`);
  return unwrap(response, "detail", { files: [], diffLines: [] });
};

export const getCommitMessages = async (analysisRunId = "latest") => {
  if (useMocks) return { messages: demoMessages, stats: messageStatsFrom(demoMessages) };
  const response = await api.get(`/analysis/runs/${analysisRunId}/commit-messages`);
  return unwrap(response, "commitMessages", { messages: [], stats: [] });
};

export const getAnalysisHistory = async (params = {}) => {
  if (useMocks) return demoHistory;
  const response = await api.get("/analysis/runs", { params });
  return unwrap(response, "history", unwrap(response, "runs", []));
};

export const getSettings = async () => {
  if (useMocks) return demoSettings;
  const response = await api.get("/settings");
  return unwrap(response, "settings", { profile: null, integrations: [], notifications: null });
};

export const updateProfile = async (payload) => {
  if (useMocks) return { ...demoUser, ...payload };
  const response = await api.patch("/settings/profile", payload);
  return unwrap(response, "user", response.data);
};

export const updatePassword = async (payload) => {
  if (useMocks) return { ok: true };
  const response = await api.patch("/settings/password", payload);
  return unwrap(response, null, { ok: true });
};

export const updateNotificationSettings = async (payload) => {
  if (useMocks) return payload;
  const response = await api.patch("/settings/notifications", payload);
  return unwrap(response, "notifications", response.data);
};

export const unlinkIntegration = async (integrationKey) => {
  if (useMocks) return { ok: true };
  const response = await api.delete(`/settings/integrations/${integrationKey}`);
  return unwrap(response, null, { ok: true });
};

const messageStatsFrom = (messages) => {
  const counts = messages.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value: value * 16 }));
};

export default api;
