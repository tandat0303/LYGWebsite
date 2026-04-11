import { useState } from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import BgImg from "../assets/bgImg.jpg";
import Logo from "../assets/logo-LY.png";
import SliderImg from "../assets/slider.avif";
import {
  FACTORY_OPTIONS,
  REQUIRE_MESSAGE,
  SLIDE_DURATION,
} from "../libs/constance";
import type { ForgotFormValues, LoginFormValues } from "../types/auth";
import {
  IdCard,
  IdCardLanyard,
  KeyRound,
  CalendarDays,
  Building2,
  Fingerprint,
} from "lucide-react";
import dayjs from "dayjs";
import { Icon } from "../components/ui/Icon";

type Mode = "login" | "forgot";

const LoginPage = () => {
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [forgotForm] = Form.useForm<ForgotFormValues>();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [sliderContent, setSliderContent] = useState<Mode>("login");

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    console.log("Login:", values);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleForgot = async (values: ForgotFormValues) => {
    setLoading(true);
    const payload = {
      ...values,
      issueDate: values.issueDate?.format("DD/MM/YYYY"),
      birthDate: values.birthDate?.format("DD/MM/YYYY"),
    };
    console.log("Change password:", payload);

    setTimeout(() => {
      setLoading(false);
      switchToLogin();
    }, 1500);
  };

  const switchToForgot = () => {
    loginForm.resetFields();
    setMode("forgot");
    setTimeout(() => setSliderContent("forgot"), SLIDE_DURATION);
  };

  const switchToLogin = () => {
    forgotForm.resetFields();
    setMode("login");
    setTimeout(() => setSliderContent("login"), SLIDE_DURATION);
  };

  const isLogin = mode === "login";

  return (
    <>
      <div className="lp-root">
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
              <p className="lp-subheading">
                Sign in to your account to continue
              </p>

              <Form
                form={loginForm}
                onFinish={handleLogin}
                layout="vertical"
                requiredMark={false}
                className="lp-form"
                style={{ width: "100%" }}
              >
                <Form.Item
                  name="accountNumber"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <Input
                    prefix={
                      <Icon>
                        <IdCard size={15} />
                      </Icon>
                    }
                    placeholder="Account Number (e.g. 34969)"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <Input.Password
                    prefix={
                      <Icon>
                        <KeyRound size={15} />
                      </Icon>
                    }
                    placeholder="••••••••"
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    htmlType="submit"
                    loading={loading}
                    block
                    className="lp-submit-btn"
                  >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
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

              <Form
                form={forgotForm}
                onFinish={handleForgot}
                layout="vertical"
                requiredMark={false}
                className="lp-form lp-form--scroll"
                style={{ width: "100%" }}
              >
                {/* Account Number */}
                <Form.Item
                  name="accountNumber"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <Input
                    prefix={
                      <Icon>
                        <IdCardLanyard size={15} />
                      </Icon>
                    }
                    placeholder="Account Number"
                    size="large"
                  />
                </Form.Item>

                {/* ID Number */}
                <Form.Item
                  name="idNumber"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <Input
                    prefix={
                      <Icon>
                        <IdCard size={15} />
                      </Icon>
                    }
                    placeholder="ID Number"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="receivedDate"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Received Day"
                    size="large"
                    style={{ width: "100%" }}
                    suffixIcon={
                      <Icon>
                        <CalendarDays size={15} />
                      </Icon>
                    }
                    className="lp-datepicker"
                    disabledDate={(d) => d && d.isAfter(dayjs())}
                  />
                </Form.Item>

                <Form.Item
                  name="birthDate"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Birthday"
                    size="large"
                    style={{ width: "100%" }}
                    suffixIcon={
                      <Icon>
                        <Fingerprint size={15} />
                      </Icon>
                    }
                    className="lp-datepicker"
                    disabledDate={(d) => d && d.isAfter(dayjs())}
                  />
                </Form.Item>

                <Form.Item
                  name="factory"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <Select
                    placeholder="Factory"
                    size="large"
                    options={FACTORY_OPTIONS}
                    className="lp-select"
                    classNames={{ popup: { root: "lp-select-dropdown" } }}
                    suffixIcon={
                      <Icon>
                        <Building2 size={15} />
                      </Icon>
                    }
                  />
                </Form.Item>

                {/* New Password */}
                <Form.Item
                  name="newPassword"
                  rules={[{ required: true, message: REQUIRE_MESSAGE }]}
                >
                  <Input.Password
                    prefix={
                      <Icon>
                        <KeyRound size={15} />
                      </Icon>
                    }
                    placeholder="New Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    htmlType="submit"
                    loading={loading}
                    block
                    className="lp-submit-btn"
                  >
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>

          {/* ── SLIDING OVERLAY ── */}
          <div className={`lp-slider${isLogin ? "" : " is-forgot"}`}>
            {/* Background image + light overlay */}
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
                {/* <p className="lp-slider__desc">Ready to access?</p> */}
                <button className="lp-slider__btn" onClick={switchToLogin}>
                  <ArrowLeftOutlined /> Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
