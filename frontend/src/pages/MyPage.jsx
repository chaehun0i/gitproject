import SettingsDialog from "@components/common/SettingsDialog";
import { useState } from "react";
import { RuntimeVisual } from "@components/common/ProductVisuals";
import PageShell from "@pages/PageShell";

const settingsIntegrations = [
  ["GitHub", "저장소 연동 준비", "연동 가능", "ready"],
  ["Git 산출물", "diff, patch, log 업로드", "사용 가능", "ready"],
  ["분석 기록", "분석 결과 다시 보기", "준비됨", "ready"],
  ["알림", "분석 완료와 검토 항목 안내", "설정 가능", "standby"],
];

const MyPage = ({ currentPage, onNavigate }) => {
  const [profileVerified, setProfileVerified] = useState(false);

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="마이페이지 / 설정"
      description="계정 정보, 저장소 연동, 알림 설정을 관리합니다."
    >
      <section className="settings-overview">
        <article className="settings-profile-panel">
          <div className="profile-avatar-large">CH</div>
          <div>
            <span className="recommend-badge">Portfolio Demo</span>
            <h2>이채훈</h2>
            <p>chaehoon@example.com</p>
          </div>
          <SettingsDialog trigger={<button type="button">프로필 수정</button>} title="프로필 수정">
            <div className="profile-edit-dialog">
              {!profileVerified ? (
                <>
                  <p>계정 정보를 변경하기 전에 비밀번호를 한 번 더 확인합니다.</p>
                  <label>현재 비밀번호<input placeholder="현재 비밀번호" type="password" /></label>
                  <button type="button" onClick={() => setProfileVerified(true)}>확인</button>
                </>
              ) : (
                <>
                  <label>이름<input defaultValue="이채훈" placeholder="이름" /></label>
                  <label>새 비밀번호<input placeholder="새 비밀번호" type="password" /></label>
                  <label>새 비밀번호 확인<input placeholder="새 비밀번호 확인" type="password" /></label>
                  <button type="button">저장</button>
                </>
              )}
            </div>
          </SettingsDialog>
        </article>

        <article className="settings-env-panel runtime-banner-card">
          <div>
            <span>작업 환경</span>
            <b>분석 준비 완료</b>
            <p>프로젝트를 선택하면 최근 변경 내용을 분석하고 결과를 확인할 수 있습니다.</p>
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
            <div><span>로그인 유지</span><b>사용 가능</b></div>
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
