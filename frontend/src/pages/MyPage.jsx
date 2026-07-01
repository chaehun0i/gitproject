import SettingsDialog from "@components/common/SettingsDialog";
import { useEffect, useState } from "react";
import PageShell from "@pages/PageShell";
import { getSettings, updateNotificationSettings } from "../api";
import { notify } from "@utils/feedback";
import { useMocks } from "@utils/mockConfig";
import "@styles/pages/myPage.css";

const integrations = [
  {
    key: "github",
    icon: "GH",
    title: "GitHub",
    subtitle: "연결 계정",
    value: "hongdev",
    status: "연결됨",
    action: "연결 관리",
  },
  {
    key: "upload",
    icon: "UP",
    title: "Git 산출물",
    subtitle: "업로드 분석",
    value: "활성화됨",
    status: "사용 가능",
    action: "설정 관리",
  },
  {
    key: "notice",
    icon: "NO",
    title: "알림",
    subtitle: "이메일 알림",
    value: "활성화됨",
    status: "활성",
    action: "알림 설정",
  },
];

const accountSettings = [
  ["LOCK", "비밀번호 변경", "계정 비밀번호를 변경합니다.", "변경"],
  ["MAIL", "이메일 변경", "계정 이메일 주소를 변경합니다.", "변경"],
  ["DEL", "계정 삭제", "계정을 삭제하고 모든 데이터를 삭제합니다.", "삭제"],
];

const notificationSettings = [
  ["DONE", "분석 완료 알림", "분석이 완료되면 이메일로 알려드립니다.", true],
  ["WARN", "이슈 감지 알림", "중요한 변경이 감지되면 알려드립니다.", true],
  ["NEW", "새로운 기능 알림", "새로운 기능과 업데이트 소식을 알려드립니다.", true],
  ["WEEK", "주간 요약 리포트", "주간 분석 요약 리포트를 받아봅니다.", false],
];

const renderIntegrationModal = (item, profile) => {
  const key = item.key;
  if (key === "github") {
    return (
      <div className="mypage-modal-body">
        <p>연결된 GitHub 계정을 확인하고 저장소 연결을 다시 관리할 수 있습니다.</p>
        <div className="mypage-modal-summary">
          <span>연결 계정</span>
          <strong>{item.value || profile.githubUsername || "-"}</strong>
        </div>
        <label>기본 저장소 접근 범위<select defaultValue="private"><option value="private">내 저장소만</option><option value="all">선택한 저장소 전체</option></select></label>
        <div className="mypage-modal-actions">
          <button type="button">다시 연결</button>
          <button className="ghost" type="button">연결 해제</button>
        </div>
      </div>
    );
  }

  if (key === "upload") {
    return (
      <div className="mypage-modal-body">
        <p>명령어로 저장한 커밋 내역과 변경 파일을 업로드해 분석하는 방식을 설정합니다.</p>
        <label>기본 분석 범위<select defaultValue="30"><option value="7">최근 7일</option><option value="30">최근 30일</option><option value="manual">직접 선택</option></select></label>
        <label>업로드 파일 보관<input defaultValue="분석 완료 후 자동 정리" readOnly /></label>
        <div className="mypage-modal-actions">
          <button type="button">설정 저장</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-modal-body">
      <p>분석 완료, 검토 필요 항목, 주간 요약 알림을 받을 방식을 관리합니다.</p>
      <label>알림 받을 이메일<input defaultValue={profile.email || ""} /></label>
      <label>요약 알림 주기<select defaultValue="important"><option value="important">중요 알림만</option><option value="all">모든 알림</option><option value="weekly">주간 요약</option></select></label>
      <div className="mypage-modal-actions">
        <button type="button">알림 저장</button>
      </div>
    </div>
  );
};

const renderAccountModal = (title, action) => {
  if (title === "비밀번호 변경") {
    return (
      <div className="mypage-modal-body">
        <p>현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.</p>
        <label>현재 비밀번호<input placeholder="현재 비밀번호" type="password" /></label>
        <label>새 비밀번호<input placeholder="새 비밀번호" type="password" /></label>
        <label>새 비밀번호 확인<input placeholder="새 비밀번호 확인" type="password" /></label>
        <div className="mypage-modal-actions">
          <button type="button">비밀번호 변경</button>
        </div>
      </div>
    );
  }

  if (title === "이메일 변경") {
    return (
      <div className="mypage-modal-body">
        <p>로그인과 알림에 사용할 이메일 주소를 변경합니다.</p>
      <label>현재 이메일<input defaultValue="" readOnly /></label>
        <label>새 이메일<input placeholder="new@example.com" type="email" /></label>
        <div className="mypage-modal-actions">
          <button type="button">인증 메일 보내기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-modal-body danger">
      <p>계정을 삭제하면 프로젝트 연결과 설정을 복구할 수 없습니다. 삭제 전 한 번 더 확인합니다.</p>
      <label>확인 문구<input placeholder="계정 삭제를 입력하세요" /></label>
      <div className="mypage-modal-actions">
        <button className="danger" type="button">{action}</button>
      </div>
    </div>
  );
};

const MyPage = ({ currentPage, onNavigate }) => {
  const [profileVerified, setProfileVerified] = useState(false);
  const [profile, setProfile] = useState({
    name: useMocks ? "이채훈" : "",
    email: useMocks ? "chaehoon@example.com" : "",
    role: useMocks ? "개발자" : "",
    joinedAt: useMocks ? "2026.06.15" : "",
    lastLoginAt: useMocks ? "2026.06.21 14:30" : "",
  });
  const [runtimeIntegrations, setRuntimeIntegrations] = useState(useMocks ? integrations : []);
  const [runtimeNotifications, setRuntimeNotifications] = useState(useMocks ? notificationSettings : []);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const data = await getSettings();
        if (!mounted) return;

        if (data.profile) {
          setProfile((current) => ({ ...current, ...data.profile }));
        }

        if (data.integrations) {
          setRuntimeIntegrations((current) => {
            if (current.length === 0) {
              return data.integrations.map((item) => ({
                icon: item.icon ?? item.key?.slice(0, 2).toUpperCase() ?? "IN",
                subtitle: item.subtitle ?? "연동 정보",
                action: item.action ?? "관리",
                ...item,
              }));
            }

            return current.map((item) => {
              const apiItem = data.integrations.find((integration) => integration.key === item.key);
              return apiItem ? { ...item, ...apiItem } : item;
            });
          });
        }

        if (data.notifications) {
          setRuntimeNotifications([
            ["analysisDone", "분석 완료 알림", "분석이 완료되면 이메일로 알려드립니다.", Boolean(data.notifications.analysisDone)],
            ["issueDetected", "이슈 감지 알림", "중요한 변경이 감지되면 알려드립니다.", Boolean(data.notifications.issueDetected)],
            ["productNews", "새로운 기능 알림", "새로운 기능과 업데이트 소식을 알려드립니다.", Boolean(data.notifications.productNews)],
            ["weeklyReport", "주간 요약 리포트", "주간 분석 요약 리포트를 받아봅니다.", Boolean(data.notifications.weeklyReport)],
          ]);
        }
      } catch {
        if (mounted) {
          notify.error("설정 정보를 불러오지 못했습니다.");
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleNotification = async (key, checked) => {
    const nextNotifications = runtimeNotifications.map((item) => (
      item[0] === key ? [item[0], item[1], item[2], checked] : item
    ));
    setRuntimeNotifications(nextNotifications);

    try {
      const payload = nextNotifications.reduce((acc, [itemKey, , , value]) => {
        acc[itemKey] = value;
        return acc;
      }, {});
      await updateNotificationSettings(payload);
      notify.success("알림 설정을 저장했습니다.");
    } catch {
      notify.error("알림 설정 저장에 실패했습니다.");
    }
  };

  return (
    <PageShell
      currentPage={currentPage}
      onNavigate={onNavigate}
      title="마이페이지"
      description="계정 정보와 서비스 설정을 관리하세요."
    >
      <section className="mypage-shell">
        <div className="mypage-top-action">
          <SettingsDialog trigger={<button type="button">설정</button>} title="서비스 설정">
            <div className="mypage-modal-body">
              <p>마이페이지에서 자주 사용하는 기본 보기와 표시 방식을 관리합니다.</p>
              <label>기본 시작 화면<select defaultValue="projects"><option value="home">홈</option><option value="projects">프로젝트</option><option value="history">분석 내역</option></select></label>
              <label>화면 밀도<select defaultValue="comfortable"><option value="comfortable">기본</option><option value="compact">촘촘하게</option></select></label>
              <div className="mypage-modal-actions">
                <button type="button">저장</button>
              </div>
            </div>
          </SettingsDialog>
        </div>

        <article className="mypage-profile-card">
          <div className="mypage-profile-info">
            <div>
              <h2>{profile.name}</h2>
              <span>{profile.role}</span>
            </div>
            <p>{profile.email}</p>
            <dl>
              <div><dt>가입일</dt><dd>{profile.joinedAt}</dd></div>
              <div><dt>마지막 로그인</dt><dd>{profile.lastLoginAt}</dd></div>
            </dl>
          </div>
          <SettingsDialog trigger={<button className="mypage-primary-button" type="button">프로필 수정</button>} title="프로필 수정">
            <div className="profile-edit-dialog">
              {!profileVerified ? (
                <>
                  <p>계정 정보를 변경하기 전에 비밀번호를 한 번 더 확인합니다.</p>
                  <label>현재 비밀번호<input placeholder="현재 비밀번호" type="password" /></label>
                  <button type="button" onClick={() => setProfileVerified(true)}>확인</button>
                </>
              ) : (
                <>
                  <label>이름<input defaultValue={profile.name} placeholder="이름" /></label>
                  <label>이메일<input defaultValue={profile.email} placeholder="이메일" type="email" /></label>
                  <label>새 비밀번호<input placeholder="새 비밀번호" type="password" /></label>
                  <label>새 비밀번호 확인<input placeholder="새 비밀번호 확인" type="password" /></label>
                  <button type="button">저장</button>
                </>
              )}
            </div>
          </SettingsDialog>
        </article>

        <section className="mypage-section-card">
          <div className="mypage-section-head">
            <div>
              <h2>연동 상태</h2>
              <p>서비스와 데이터 연동 상태를 확인하세요.</p>
            </div>
          </div>
          <div className="mypage-integration-grid">
            {runtimeIntegrations.map((item) => (
              <article className="mypage-integration-card" key={item.key}>
                <div className="mypage-card-icon">{item.icon}</div>
                <div>
                  <div className="mypage-card-title">
                    <h3>{item.title}</h3>
                    <span>{item.status}</span>
                  </div>
                  <p>{item.subtitle}</p>
                  <strong>{item.value}</strong>
                </div>
                <SettingsDialog trigger={<button type="button">{item.action}</button>} title={`${item.title} 관리`}>
                  {renderIntegrationModal(item, profile)}
                </SettingsDialog>
              </article>
            ))}
          </div>
        </section>

        <section className="mypage-settings-grid">
          <article className="mypage-section-card">
            <div className="mypage-section-head">
              <div>
                <h2>계정 설정</h2>
                <p>계정 보안과 환경 설정을 관리하세요.</p>
              </div>
            </div>
            <div className="mypage-setting-list">
              {accountSettings.map(([icon, title, text, action]) => (
                <div className={action === "삭제" ? "mypage-setting-row danger" : "mypage-setting-row"} key={title}>
                  <span>{icon}</span>
                  <div>
                    <b>{title}</b>
                    <p>{text}</p>
                  </div>
                  <SettingsDialog trigger={<button type="button">{action}</button>} title={title}>
                    {renderAccountModal(title, action)}
                  </SettingsDialog>
                </div>
              ))}
            </div>
          </article>

          <article className="mypage-section-card">
            <div className="mypage-section-head">
              <div>
                <h2>알림 설정</h2>
                <p>원하는 알림을 선택하세요.</p>
              </div>
            </div>
            <div className="mypage-notice-list">
              {runtimeNotifications.map(([key, title, text, checked]) => (
                <label className="mypage-notice-row" key={key}>
                  <span>{key.slice(0, 4).toUpperCase()}</span>
                  <div>
                    <b>{title}</b>
                    <p>{text}</p>
                  </div>
                  <input checked={checked} type="checkbox" onChange={(event) => toggleNotification(key, event.target.checked)} />
                </label>
              ))}
            </div>
          </article>
        </section>

      </section>
    </PageShell>
  );
};

export default MyPage;
