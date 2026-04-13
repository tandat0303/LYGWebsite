import { useState } from "react";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import BgImg from "../../assets/bgImg.jpg";
import Logo from "../../assets/logo-LY.png";
import SliderImg from "../../assets/slider.avif";
import { SLIDE_DURATION } from "../../libs/constance";
import type { ForgotFormValues, LoginFormValues } from "../../types/auth";
import { LoginForm } from "./LoginForm";
import { ForgotForm } from "./ForgotForm";
import { LanguageBadge } from "../../components/ui/LanguageBadge";

type Mode = "login" | "forgot";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  // const [navigating, setNavigating] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [sliderContent, setSliderContent] = useState<Mode>("login");

  const isLogin = mode === "login";

  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // const { accessToken, user, isHydrated } = useAppSelector((s) => s.auth);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    console.log("Login:", values);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleForgot = async (values: ForgotFormValues) => {
    setLoading(true);
    const payload = {
      ...values,
      receivedDate: values.receivedDate?.format("DD/MM/YYYY"),
      birthDate: values.birthDate?.format("DD/MM/YYYY"),
    };
    console.log("Change password:", payload);
    setTimeout(() => {
      setLoading(false);
      switchToLogin();
    }, 1500);
  };

  const switchToForgot = () => {
    setMode("forgot");
    setTimeout(() => setSliderContent("forgot"), SLIDE_DURATION);
  };

  const switchToLogin = () => {
    setMode("login");
    setTimeout(() => setSliderContent("login"), SLIDE_DURATION);
  };

  return (
    <div className="lp-root">
      <LanguageBadge />
      <img src={BgImg} alt="" className="lp-bg" />
      <div className="lp-bg-overlay" />

      <div className="lp-container">
        <div className="lp-panels">
          {/* ── LEFT: LOGIN ── */}
          <div className="lp-panel lp-panel--login">
            <div className="lp-logo">
              <img src={Logo} alt="Logo" />
            </div>
            <h1 className="lp-heading">Welcome Back</h1>
            <p className="lp-subheading">Sign in to your account to continue</p>
            <LoginForm
              key={`mode-${mode}`}
              onFinish={handleLogin}
              loading={loading && isLogin}
            />
          </div>

          {/* ── RIGHT: FORGOT ── */}
          <div className="lp-panel lp-panel--forgot">
            <div className="lp-logo">
              <img src={Logo} alt="Logo" />
            </div>
            <h1 className="lp-heading">Reset Password</h1>
            <p className="lp-subheading">
              Enter your information to reset password
            </p>
            <ForgotForm
              key={`mode-${mode}`}
              onFinish={handleForgot}
              loading={loading && !isLogin}
            />
          </div>
        </div>

        {/* ── SLIDING OVERLAY ── */}
        <div className={`lp-slider${isLogin ? "" : " is-forgot"}`}>
          <img src={SliderImg} alt="" className="lp-slider__bg" />
          <div className="lp-slider__overlay" />

          {sliderContent === "login" ? (
            <>
              <h2 className="lp-slider__title">
                Forgot your
                <br />
                Password?
              </h2>
              <button className="lp-slider__btn" onClick={switchToForgot}>
                Reset Password <ArrowRightOutlined />
              </button>
            </>
          ) : (
            <>
              <h2 className="lp-slider__title">
                Ready to
                <br />
                Access?
              </h2>
              <button className="lp-slider__btn" onClick={switchToLogin}>
                <ArrowLeftOutlined /> Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
