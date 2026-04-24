import { useState } from "react";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import BgImg from "../../assets/images/bgImg.jpg";
import Logo from "../../assets/images/logo-LY.png";
import SliderImg from "../../assets/images/slider.avif";
import { SLIDE_DURATION } from "../../libs/constance";
import type {
  ForgotFormValues,
  LoginFormValues,
  LoginPayload,
} from "../../types/auth";
import { LoginForm } from "./LoginForm";
import { ForgotForm } from "./ForgotForm";
import { LanguageBadge } from "../../components/ui/LanguageBadge";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/auth";
import authApi from "../../api/auth";
import { setToken } from "../../features/authSlice";
import { AppAlert } from "../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../libs/helper";
import Loading from "../../components/ui/Loading";
import { fetchVehicles } from "../../features/transportSlice";
import { useTranslation } from "../../hooks/useTranslation";

type Mode = "login" | "forgot";

const AuthPage = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [sliderContent, setSliderContent] = useState<Mode>("login");

  const isLogin = mode === "login";

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, user, isHydrated } = useAppSelector((s) => s.auth);

  if (!isHydrated) return null;
  if (navigating) return <Loading fullScreen />;
  if (!navigating && accessToken && user) return <Navigate to="/" replace />;

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const payload: LoginPayload = {
        userId: values.userId,
        password: values.password,
        factory: values.factory,
        exponentPushToken: "NULL",
        DeviceInfo: "NULL",
      };
      const data = await authApi.login(payload);
      const accessToken = data?.accessToken;
      const user = data?.user;

      if (data.authenticated) {
        dispatch(setToken({ accessToken, user: user }));
        dispatch(fetchVehicles(user.factory));
        setNavigating(true);
        setTimeout(() => navigate("/", { replace: true }), 1000);
      } else {
        AppAlert({ icon: "error", title: t(data.message) });
      }
    } catch (error: any) {
      if (error?.response?.message === "saiThongTinDangNhap") {
        AppAlert({ icon: "error", title: "Invalid information" });
      } else {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    } finally {
      setLoading(false);
    }
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
    <div className="w-full h-screen overflow-hidden relative flex items-center justify-center">
      <LanguageBadge />

      <img
        src={BgImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,37,68,0.82) 0%, rgba(15,37,68,0.6) 40%, rgba(15,37,68,0.75) 100%)",
        }}
      />

      <div
        className="relative z-2 flex flex-col w-screen h-screen rounded-none overflow-hidden
                   sm:flex-row sm:w-[min(920px,95vw)] sm:h-[min(620px,96vh)] sm:rounded-3xl"
        style={{
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex w-full h-full">
          <div
            className="flex-[0_0_100%] h-full flex flex-col items-center justify-center
                       bg-white/7 backdrop-blur-[28px] border border-white/10
                       transition-opacity duration-500 ease-in-out
                       sm:flex-[0_0_50%] sm:border-r sm:border-r-white/8"
            style={{ padding: "48px 44px" }}
          >
            <div
              className="flex justify-center w-full"
              style={{ marginBottom: "14px" }}
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-11 w-auto object-contain"
              />
            </div>

            <h1
              className="text-[22px] font-bold text-white text-center tracking-[-0.3px]"
              style={{ marginBottom: "6px" }}
            >
              {t("chaoMungQuayTroLai")}
            </h1>

            {/* <p
              className="text-[13px] text-white/55 text-center leading-[1.55]"
              style={{ marginBottom: "28px" }}
            >
              Sign in to your account to continue
            </p> */}

            <LoginForm
              key={`mode-${mode}`}
              onFinish={handleLogin}
              loading={loading && isLogin}
            />
          </div>

          <div
            className="flex-[0_0_100%] h-full flex flex-col items-center justify-center
                       bg-white/7 backdrop-blur-[28px] border border-white/10
                       transition-opacity duration-500 ease-in-out
                       sm:flex-[0_0_50%] sm:border-l sm:border-l-white/8"
            style={{ padding: "48px 44px" }}
          >
            <div
              className="flex justify-center w-full"
              style={{ marginBottom: "14px" }}
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-11 w-auto object-contain"
              />
            </div>

            <h1
              className="text-[22px] font-bold text-white text-center tracking-[-0.3px]"
              style={{ marginBottom: "6px" }}
            >
              {t("doiMatKhau")}
            </h1>

            {/* <p
              className="text-[13px] text-white/55 text-center leading-[1.55]"
              style={{ marginBottom: "28px" }}
            >
              Enter your information to reset password
            </p> */}

            <ForgotForm
              key={`mode-${mode}`}
              onFinish={handleForgot}
              loading={loading && !isLogin}
            />
          </div>
        </div>

        <div
          className={`hidden sm:flex absolute top-0 left-1/2 w-1/2 h-full z-10
                      flex-col items-center justify-center text-center
                      transition-transform duration-720 ease-[cubic-bezier(0.77,0,0.175,1)]
                      will-change-transform
                      ${isLogin ? "" : "-translate-x-full"}`}
          style={{ padding: "48px 40px" }}
        >
          <img
            src={SliderImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />

          <div
            className="absolute inset-0 z-1"
            style={{
              background:
                "linear-gradient(160deg, rgba(15,37,68,0.72) 0%, rgba(15,37,68,0.52) 100%)",
            }}
          />

          {sliderContent === "login" ? (
            <>
              <h2
                className="relative z-2 text-[clamp(26px,3.5vw,36px)] font-bold italic text-white leading-[1.2] mb-6"
                style={{ marginBottom: "24px" }}
              >
                {t("quenMatKhau")}
              </h2>

              {/* lp-slider__btn */}
              <button
                className="relative z-2 inline-flex items-center gap-2.5 rounded-full
                           border-2 border-white/55 bg-transparent text-white
                           text-[14px] font-semibold tracking-[0.5px] cursor-pointer
                           transition-all duration-220 ease-in
                           hover:bg-white/12 hover:border-white hover:-translate-y-px
                           active:scale-[0.98] disabled:opacity-50"
                style={{ padding: "13px 32px" }}
                onClick={switchToForgot}
                disabled={loading}
              >
                {t("doiMatKhau")} <ArrowRightOutlined />
              </button>
            </>
          ) : (
            <>
              <h2 className="relative z-2 text-[clamp(26px,3.5vw,36px)] font-bold italic text-white leading-[1.2] mb-6">
                {t("dangNhap")} ?
              </h2>

              <button
                className="relative z-2 inline-flex items-center gap-2.5 rounded-full
                           border-2 border-white/55 bg-transparent text-white
                           text-[14px] font-semibold tracking-[0.5px] cursor-pointer
                           transition-all duration-220 ease-in
                           hover:bg-white/12 hover:border-white hover:-translate-y-px
                           active:scale-[0.98] disabled:opacity-50"
                style={{ padding: "13px 32px" }}
                onClick={switchToLogin}
                disabled={loading}
              >
                <ArrowLeftOutlined /> {t("dangNhap")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
