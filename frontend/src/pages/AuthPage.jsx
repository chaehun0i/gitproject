import { notify } from "@utils/feedback";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@stores/slices/authSlice";
import commitlensLogo from "@assets/images/commitlens-logo.png";
import { loginUser } from "../api";
import { useMocks } from "@utils/mockConfig";
import "@styles/pages/auth.css";

const AuthPage = ({ onNavigate }) => {
  const dispatch = useDispatch();

  const login = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const user = await loginUser({
        email: form.get("email"),
        password: form.get("password"),
      });
      dispatch(loginAction(user));
      notify.success("로그인되었습니다.");
      onNavigate("home");
    } catch {
      notify.error("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <button className="auth-brand" type="button" onClick={() => onNavigate("dashboard")}>
          <img alt="CommitLens" src={commitlensLogo} />
        </button>
        <span className="auth-pill">AI 커밋 분석</span>
        <h1>
          변경 내용을 이해하고
          <br />
          더 좋은 커밋을 남기세요.
        </h1>
        <p>
          최근 변경 사항, 검토할 항목, 추천 커밋 메시지를 빠르게 확인할 수 있습니다.
        </p>

        <div className="auth-analysis-card" aria-hidden="true">
          <div className="product-card-top">
            <span />
            <span />
            <span />
            <b>분석 요약</b>
          </div>
          <div className="auth-analysis-body">
            <div>
              <small>검토할 변경</small>
              <strong>8개</strong>
            </div>
            <div>
              <small>추천 메시지</small>
              <strong>3개</strong>
            </div>
            <div className="auth-message-preview">
              <code>feat(auth): 로그인 유지 흐름 개선</code>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-area">
        <form className="login-card" onSubmit={login}>
          <h2>로그인</h2>
          <p>분석 워크스페이스로 이동합니다.</p>
          <label>이메일<input name="email" placeholder="이메일 주소" type="email" defaultValue={useMocks ? "chaehoon@example.com" : ""} /></label>
          <label>비밀번호<input name="password" placeholder="비밀번호" type="password" defaultValue={useMocks ? "demo1234" : ""} /></label>
          <div className="auth-options">
            <label><input defaultChecked type="checkbox" /> 로그인 상태 유지</label>
            <a href="#forgot">비밀번호 찾기</a>
          </div>
          <button type="submit">로그인</button>
          <div className="divider"><span>또는</span></div>
          <button className="github-button" type="button" onClick={() => notify.info("GitHub 로그인은 추후 연결 예정입니다.")}>
            GitHub로 로그인
          </button>
          <p className="signup-text">계정이 없으신가요? <button type="button" onClick={() => onNavigate("signup")}>회원가입</button></p>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;
