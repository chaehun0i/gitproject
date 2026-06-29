import SettingsDialog from "@components/common/SettingsDialog";
import PageShell from "@pages/PageShell";

const MyPage = ({ currentPage, onNavigate }) => {
  return (
    <PageShell currentPage={currentPage} onNavigate={onNavigate} title="마이페이지 / 설정" description="프로필, GitHub 연동, API와 알림 설정을 관리합니다.">
      <section className="settings-layout">
        <article className="page-card profile-card-large">
          <span>CH</span>
          <div>
            <h2>이채훈</h2>
            <p>chaehoon@example.com</p>
          </div>
          <button type="button">프로필 수정</button>
        </article>

        <article className="page-card settings-card">
          <h2>연동 상태</h2>
          <div className="settings-row"><b>GitHub 연동</b><span className="done-label">연결됨</span></div>
          <div className="settings-row"><b>Git 산출물 업로드</b><span className="done-label">사용 가능</span></div>
          <div className="settings-row"><b>API Key</b><span className="wait-label">등록 전</span></div>
        </article>

        <article className="page-card settings-card">
          <h2>알림 설정</h2>
          <label className="toggle-row"><input defaultChecked type="checkbox" /> 분석 완료 알림</label>
          <label className="toggle-row"><input defaultChecked type="checkbox" /> 위험 변경 감지 알림</label>
          <label className="toggle-row"><input type="checkbox" /> 주간 리포트 알림</label>
        </article>

        <article className="page-card settings-card wide">
          <h2>고급 설정</h2>
          <p>포트폴리오 데모에서는 Radix Dialog 기반 긴 설정창으로 API Endpoint와 Webhook 입력 흐름을 보여줍니다.</p>
          <SettingsDialog trigger={<button type="button">긴 설정창 열기</button>} title="API 설정">
            <label>API Endpoint<input placeholder="https://api.example.com" /></label>
            <label>Notification Webhook<input placeholder="https://hooks.example.com" /></label>
            <button type="button">저장</button>
          </SettingsDialog>
        </article>
      </section>
    </PageShell>
  );
};

export default MyPage;
