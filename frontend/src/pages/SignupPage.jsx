import { ProductHeroVisual } from "@components/common/ProductVisuals";
import { notify } from "@utils/feedback";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@stores/slices/authSlice";
import { signupUser } from "../api";
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
      dispatch(loginAction({
        id: "demo-user",
        name: form.get("name") || "이채훈",
        email: form.get("email") || "chaehoon@example.com",
      }));
      notify.info("백엔드 연결 전 데모 계정으로 시작합니다.");
      onNavigate("home");
    }
  };

  return (
    <main className="auth-page signup-page">
      <section className="auth-visual">
        <button className="auth-brand" type="button" onClick={() => onNavigate("dashboard")}>
          <span>&lt;/&gt;</span>
          <strong>CommitLens</strong>
        </button>
        <span className="auth-pill">포트폴리오형 AI 분석 서비스</span>
        <h1>
          프로젝트 변경 이력을
          <br />
          <em>한 번에 설명</em>해보세요.
        </h1>
        <p>
          파일 업로드 분석과 GitHub 연동 분석을 모두 지원하는 화면 흐름으로,
          백엔드 분석 파이프라인을 시각적으로 보여줍니다.
        </p>
        <div className="auth-illustration" aria-hidden="true">
          <ProductHeroVisual compact />
        </div>
      </section>

      <section className="auth-form-area">
        <form className="login-card" onSubmit={signup}>
          <h2>회원가입</h2>
          <p>기본 계정을 만들고 분석 워크스페이스를 시작하세요.</p>
          <label>이름<input name="name" placeholder="이름" defaultValue="이채훈" /></label>
          <label>이메일<input name="email" placeholder="이메일 주소" type="email" defaultValue="chaehoon@example.com" /></label>
          <label>비밀번호<input name="password" placeholder="비밀번호" type="password" defaultValue="demo1234" /></label>
          <label className="check-row"><input defaultChecked type="checkbox" /> 서비스 이용 약관과 AI 분석 데이터 처리 방침에 동의합니다.</label>
          <button type="submit">회원가입</button>
          <button className="github-button" type="button" onClick={() => notify.info("GitHub OAuth 연동 예정입니다.")}>
            GitHub 계정으로 시작
          </button>
          <p className="signup-text">이미 계정이 있으신가요? <button type="button" onClick={() => onNavigate("auth")}>로그인</button></p>
        </form>
      </section>
    </main>
  );
};

export default SignupPage;
