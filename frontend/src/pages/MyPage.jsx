import SettingsDialog from "@components/common/SettingsDialog";
import { RuntimeVisual } from "@components/common/ProductVisuals";
import PageShell from "@pages/PageShell";

const settingsIntegrations = [
  ["GitHub", "저장소 연동 준비", "연동 가능", "ready"],
  ["Git 산출물", "diff, patch, log 업로드", "사용 가능", "ready"],
  ["MariaDB", "127.0.0.1:3307 / app", "연결 기준", "ready"],
  ["Redis", "JWE uuid 세션 유지", "백엔드 연동", "ready"],
  ["PostgreSQL", "pgdb 보조 컨테이너", "대기", "standby"],
  ["AI Runtime", "요약/추천 메시지 생성", "Mock 가능", "standby"],
];

const MyPage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="마이페이지 / 설정"
      description="계정, 연동 상태, API 설정, 로컬 런타임 상태를 관리합니다."
    >
      <section className="settings-overview">
        <article className="settings-profile-panel">
          <div className="profile-avatar-large">CH</div>
          <div>
            <span className="recommend-badge">Portfolio Demo</span>
            <h2>이채훈</h2>
            <p>chaehoon@example.com</p>
          </div>
          <button type="button">프로필 수정</button>
        </article>

        <article className="settings-env-panel runtime-banner-card">
          <div>
            <span>Local Runtime</span>
            <b>MariaDB 3307 · Redis Session</b>
            <p>백엔드는 로컬에서 실행하고, DB 컨테이너는 Docker Desktop에서 관리하는 흐름을 기준으로 표시합니다.</p>
          </div>
          <RuntimeVisual />
        </article>
      </section>

      <section className="settings-layout refined-settings">
        <article className="page-card settings-card integration-card">
          <div className="panel-title">
            <h2>연동 상태</h2>
            <button type="button">새로고침</button>
          </div>
          <div className="integration-list">
            {settingsIntegrations.map(([name, description, status, type]) => (
              <div className="integration-item" key={name}>
                <span>{name.slice(0, 2).toUpperCase()}</span>
                <div>
                  <b>{name}</b>
                  <p>{description}</p>
                </div>
                <em className={type === "ready" ? "done-label" : "wait-label"}>{status}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="page-card settings-card">
          <h2>알림 설정</h2>
          <label className="toggle-row"><input defaultChecked type="checkbox" /> 분석 완료 알림</label>
          <label className="toggle-row"><input defaultChecked type="checkbox" /> 위험 변경 감지 알림</label>
          <label className="toggle-row"><input type="checkbox" /> 주간 분석 리포트</label>
          <label className="toggle-row"><input defaultChecked type="checkbox" /> 커밋 메시지 추천 알림</label>
        </article>

        <article className="page-card settings-card wide api-settings-card">
          <div>
            <h2>API / 고급 설정</h2>
            <p>긴 설정은 Radix Dialog로 분리해 어느 화면에서든 같은 호출 방식으로 사용할 수 있게 유지합니다.</p>
          </div>
          <div className="settings-summary-grid">
            <div><span>API Base URL</span><b>/api</b></div>
            <div><span>Mock Data</span><b>VITE_USE_MOCKS</b></div>
            <div><span>Session</span><b>JWE + Redis</b></div>
          </div>
          <SettingsDialog trigger={<button type="button">긴 설정창 열기</button>} title="API 설정">
            <label>API Endpoint<input placeholder="https://api.example.com" /></label>
            <label>Notification Webhook<input placeholder="https://hooks.example.com" /></label>
            <button type="button">저장</button>
          </SettingsDialog>
        </article>

        <article className="page-card settings-card danger-zone-card">
          <h2>위험 액션</h2>
          <p>분석 이력 삭제, 연동 해제 같은 작업은 별도 확인 모달을 통해 처리합니다.</p>
          <button type="button">GitHub 연동 해제</button>
        </article>
      </section>
    </PageShell>
  );
};

export default MyPage;
