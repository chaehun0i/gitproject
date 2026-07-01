import { notify } from "@utils/feedback";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@stores/slices/authSlice";
import commitlensLogo from "@assets/images/commitlens-logo.png";
import { signupUser } from "../api";
import { useMocks } from "@utils/mockConfig";
import "@styles/pages/auth.css";

const SignupPage = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const signup = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const user = await signupUser({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      dispatch(loginAction(user));
      notify.success("회원가입이 완료되었습니다.");
      onNavigate("home");
    } catch {
      notify.error("회원가입에 실패했습니다. 입력 내용을 확인하세요.");
    }
  };

  return (
    <main className="auth-page signup-page">
      <section className="auth-visual">
        <button className="auth-brand" type="button" onClick={() => onNavigate("dashboard")}>
          <img alt="CommitLens" src={commitlensLogo} />
        </button>
        <span className="auth-pill">AI 커밋 분석</span>
        <h1>
          변경 기록을 정리하고
          <br />
          첫 분석을 시작하세요.
        </h1>
        <p>
          계정을 만들면 저장소를 연결하고 최근 변경 내용을 바로 확인할 수 있습니다.
        </p>
        <div className="auth-analysis-card" aria-hidden="true">
          <div className="product-card-top">
            <span />
            <span />
            <span />
            <b>시작 준비</b>
          </div>
          <div className="auth-analysis-body">
            <div>
              <small>저장소 연결</small>
              <strong>준비됨</strong>
            </div>
            <div>
              <small>분석 옵션</small>
              <strong>4개</strong>
            </div>
            <div className="auth-message-preview">
              <code>분석할 프로젝트를 선택하세요</code>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-area">
        <form className="login-card" onSubmit={signup}>
          <h2>회원가입</h2>
          <p>계정을 만들고 첫 분석을 준비하세요.</p>
          <label>이름<input name="name" placeholder="이름" defaultValue={useMocks ? "이채훈" : ""} /></label>
          <label>이메일<input name="email" placeholder="이메일 주소" type="email" defaultValue={useMocks ? "chaehoon@example.com" : ""} /></label>
          <label>비밀번호<input name="password" placeholder="비밀번호" type="password" defaultValue={useMocks ? "demo1234" : ""} /></label>
          <label className="check-row"><input defaultChecked type="checkbox" /> 서비스 이용 약관과 분석 데이터 처리 방침에 동의합니다.</label>
          <button type="submit">회원가입</button>
          <button className="github-button" type="button" onClick={() => notify.info("GitHub 계정 연결은 추후 제공 예정입니다.")}>
            GitHub 계정으로 시작
          </button>
          <p className="signup-text">이미 계정이 있으신가요? <button type="button" onClick={() => onNavigate("auth")}>로그인</button></p>
        </form>
      </section>
    </main>
  );
};

export default SignupPage;
