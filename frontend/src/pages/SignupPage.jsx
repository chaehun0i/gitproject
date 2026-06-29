import heroImage from "@assets/images/commitlens-hero.png";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@stores/slices/authSlice";
import { notify } from "@utils/feedback";
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
      notify.error("회원가입에 실패했습니다. 이미 가입된 이메일이거나 서버 연결이 필요합니다.");
    }
  };

  return (
    <main className="auth-page signup-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <span>&lt;/&gt;</span>
          <strong>CommitLens</strong>
        </div>
        <span className="auth-pill">포트폴리오용 AI Git 분석 데모</span>
        <h1>
          Git 변경 흐름을
          <br />
          <em>한 화면에서</em> 설명하세요.
        </h1>
        <p>
          가입 후 Git 산출물 업로드 분석과 GitHub 연동 분석 흐름을 모두 확인할 수 있습니다.
        </p>
        <div className="auth-illustration" aria-hidden="true">
          <img alt="" src={heroImage} />
        </div>
      </section>

      <section className="auth-form-area">
        <form className="login-card" onSubmit={signup}>
          <h2>회원가입</h2>
          <p>포트폴리오 데모 계정을 생성합니다.</p>
          <label>이름<input name="name" placeholder="이름을 입력하세요" defaultValue="이채훈" /></label>
          <label>이메일<input name="email" placeholder="이메일 주소를 입력하세요" type="email" /></label>
          <label>비밀번호<input name="password" placeholder="비밀번호를 입력하세요" type="password" /></label>
          <label className="check-row"><input defaultChecked type="checkbox" /> 서비스 이용약관과 분석 데이터 처리 안내에 동의합니다.</label>
          <button type="submit">가입하고 시작하기</button>
          <p className="signup-text">이미 계정이 있으신가요? <button type="button" onClick={() => onNavigate("auth")}>로그인</button></p>
        </form>
      </section>
    </main>
  );
};

export default SignupPage;
