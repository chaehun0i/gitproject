import { ProductHeroVisual } from "@components/common/ProductVisuals";
import { notify } from "@utils/feedback";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@stores/slices/authSlice";
import { loginUser } from "../api";
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
      dispatch(loginAction({
        id: "demo-user",
        name: "이채훈",
        email: form.get("email") || "chaehoon@example.com",
      }));
      notify.info("백엔드 연결 전 데모 세션으로 로그인했습니다.");
      onNavigate("home");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <button className="auth-brand" type="button" onClick={() => onNavigate("dashboard")}>
          <span>&lt;/&gt;</span>
          <strong>CommitLens</strong>
        </button>
        <span className="auth-pill">AI 기반 Git 분석 플랫폼</span>
        <h1>
          커밋을 분석하고,
          <br />
          <em>더 나은 개발</em>을 만드세요.
        </h1>
        <p>
          Git 산출물과 GitHub 저장소 데이터를 분석해 변경 흐름, 위험 포인트,
          추천 커밋 메시지를 개발자 워크스페이스 형태로 제공합니다.
        </p>

        <div className="auth-illustration" aria-hidden="true">
          <ProductHeroVisual compact />
          <div className="floating-card summary">
            <b>AI 요약</b>
            <p>인증 흐름 변경과 테스트 추가가 감지되었습니다.</p>
          </div>
          <div className="floating-card files">
            <b>주요 변경 파일</b>
            <small>src/auth/login.tsx +62 -4</small>
            <small>src/utils/tokens.ts +28 -2</small>
            <small>tests/auth.test.ts +37 -1</small>
          </div>
        </div>

        <div className="auth-features">
          <div><span>G</span><b>Git 산출물 분석</b><small>log, diff, patch 업로드</small></div>
          <div><span>AI</span><b>변경 인사이트</b><small>영향도와 위험도 파악</small></div>
          <div><span>CM</span><b>메시지 추천</b><small>상황에 맞는 커밋 제안</small></div>
        </div>
      </section>

      <section className="auth-form-area">
        <form className="login-card" onSubmit={login}>
          <h2>로그인</h2>
          <p>CommitLens에 오신 것을 환영합니다.</p>
          <label>이메일<input name="email" placeholder="이메일 주소" type="email" defaultValue="chaehoon@example.com" /></label>
          <label>비밀번호<input name="password" placeholder="비밀번호" type="password" defaultValue="demo1234" /></label>
          <div className="auth-options">
            <label><input defaultChecked type="checkbox" /> 로그인 상태 유지</label>
            <a href="#forgot">비밀번호를 잊으셨나요?</a>
          </div>
          <button type="submit">로그인</button>
          <div className="divider"><span>또는</span></div>
          <button className="github-button" type="button" onClick={() => notify.info("GitHub OAuth 연동 예정입니다.")}>
            GitHub로 로그인
          </button>
          <p className="signup-text">계정이 없으신가요? <button type="button" onClick={() => onNavigate("signup")}>회원가입</button></p>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;
