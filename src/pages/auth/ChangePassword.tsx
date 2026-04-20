import { useState } from "react";
import { Form, Input, Button } from "antd";
import {
  KeyRound,
  ShieldCheck,
  // CheckCircle2, RotateCcw
} from "lucide-react";
import { Icon } from "../../components/ui/Icon";
import bannerImg from "../../assets/images/reset-password.png";
import { REQUIRE_MESSAGE } from "../../libs/constance";
import type {
  ChangePasswordPayload,
  ChangePasswordValues,
} from "../../types/auth";
import { useAppSelector } from "../../hooks/auth";
import authApi from "../../api/auth";
import { AppAlert } from "../../components/ui/AppAlert";

export default function ChangePassword() {
  const user = useAppSelector((s) => s.auth.user);

  const [form] = Form.useForm<ChangePasswordValues>();
  const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);

  const handleFinish = async (values: ChangePasswordValues) => {
    if (!user) return;
    try {
      setLoading(true);

      const payload: ChangePasswordPayload = {
        userId: user.userId,
        factory: user.factory,
        password: values.password,
        newPassword: values.newPassword,
      };

      const res = await authApi.changePassword(payload);

      if (res.status) {
        // setSuccess(true);
        AppAlert({ icon: "success", title: "Password changed successfully" });
        form.resetFields();
      } else {
        AppAlert({ icon: "error", title: "Invalid information" });
      }
    } catch (error) {
      if (!error?.response?.status) {
        AppAlert({ icon: "error", title: "Invalid information" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center box-border cp-page"
      style={{ padding: "32px 24px" }}
    >
      <div className="w-full max-w-[400px] flex flex-col items-center gap-8 animate-[cp-rise_0.38s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <img
            src={bannerImg}
            alt="Đổi mật khẩu"
            className="w-20 h-20 object-contain select-none transition-[filter] duration-300 ease-[ease] cp-hero__img"
            draggable={false}
          />
          <h1 className="text-[22px] font-bold m-0 tracking-[-0.2px] transition-colors duration-300 ease-[ease] cp-hero__title">
            Đổi mật khẩu
          </h1>
          {/* <p className="cp-hero__sub">
            Cập nhật mật khẩu để bảo vệ tài khoản của bạn
          </p> */}
        </div>

        {/* ── Success ── */}
        {/* {success && (
          <div className="cp-success">
            <CheckCircle2
              size={48}
              className="cp-success__icon"
              strokeWidth={1.5}
            />
            <p className="cp-success__title">Cập nhật thành công!</p>
            <p className="cp-success__sub">
              Mật khẩu của bạn đã được thay đổi.
            </p>
            <button className="cp-retry-btn" onClick={() => setSuccess(false)}>
              <RotateCcw size={13} /> Đổi lại mật khẩu
            </button>
          </div>
        )} */}

        {/* ── Form ── */}
        {/* {!success && ( */}
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          requiredMark={false}
          className="lp-form w-full"
          autoComplete="off"
        >
          <div className="flex flex-col mb-1">
            <label className="text-[13px] font-semibold mb-1.5 transition-colors duration-300 ease-[ease] cp-label">
              Mật khẩu hiện tại
            </label>
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
                placeholder="Nhập mật khẩu hiện tại"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="flex flex-col mb-1">
            <label className="text-[13px] font-semibold mb-1.5 transition-colors duration-300 ease-[ease] cp-label">
              Mật khẩu mới
            </label>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: REQUIRE_MESSAGE },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password
                prefix={
                  <Icon>
                    <ShieldCheck size={15} />
                  </Icon>
                }
                placeholder="Nhập mật khẩu mới"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="flex flex-col mb-1">
            <label className="text-[13px] font-semibold mb-1.5 transition-colors duration-300 ease-[ease] cp-label">
              Xác nhận mật khẩu mới
            </label>
            <Form.Item
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: REQUIRE_MESSAGE },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value)
                      return Promise.resolve();
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={
                  <Icon>
                    <ShieldCheck size={15} />
                  </Icon>
                }
                placeholder="Nhập lại mật khẩu mới"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              htmlType="submit"
              loading={loading}
              block
              className="lp-submit-btn"
            >
              Cập nhật mật khẩu
            </Button>
          </Form.Item>
        </Form>
        {/* )} */}
      </div>

      <style>{`
        @keyframes cp-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cp-hero__img {
          filter: var(--cp-img-filter);
        }

        .dark  { --cp-img-filter: opacity(0.8); }
        .light { --cp-img-filter: opacity(0.85); }

        .dark .cp-hero__title  { color: rgba(255,255,255,0.92); }
        .light .cp-hero__title { color: #0f2544; }

        .cp-hero__sub {
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          transition: color 0.3s ease;
        }
        .dark .cp-hero__sub  { color: rgba(255,255,255,0.4); }
        .light .cp-hero__sub { color: #64748b; }
        
        .dark .cp-label  { color: rgba(255,255,255,0.55); }
        .light .cp-label { color: #475569; }

        /* Light mode form overrides */
        .light .lp-form .ant-input-affix-wrapper, .light .lp-form .ant-input-suffix {
          background: rgba(255,255,255,0.7) !important;
          border-color: #e2e8f0 !important;
          color: #0f172a !important;
        }
        .light .lp-form .ant-input-affix-wrapper input { color: #0f172a !important; }
        .light .lp-form .ant-input-affix-wrapper input::placeholder { color: #94a3b8 !important; }
        .light .lp-form .ant-input-prefix { color: #2563eb !important; }
        .light .lp-form .ant-input-affix-wrapper:hover { border-color: #93c5fd !important; }
        .light .lp-form .ant-input-affix-wrapper-focused,
        .light .lp-form .ant-input-affix-wrapper:focus-within {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important;
        }
        .light .lp-form .ant-form-item-explain-error { color: #ef4444 !important; }
        .light .lp-submit-btn {
          background: linear-gradient(135deg, #2563eb 0%, #1a3a6e 100%) !important;
        }

        /* Success */
        .cp-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          animation: cp-rise 0.35s ease;
          width: 100%;
        }
        .cp-success__icon { transition: color 0.3s; margin-bottom: 4px; }
        .dark .cp-success__icon  { color: #93c5fd; }
        .light .cp-success__icon { color: #2563eb; }

        .cp-success__title {
          font-size: 17px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          transition: color 0.3s;
        }
        .dark .cp-success__title  { color: rgba(255,255,255,0.9); }
        .light .cp-success__title { color: #0f2544; }

        .cp-success__sub {
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          margin: 0 0 8px;
          transition: color 0.3s;
        }
        .dark .cp-success__sub  { color: rgba(255,255,255,0.45); }
        .light .cp-success__sub { color: #64748b; }

        .cp-retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.15s;
        }
        .dark .cp-retry-btn  { color: #93c5fd; }
        .light .cp-retry-btn { color: #2563eb; }

        /* Responsive */
        @media (max-width: 640px) {
          .cp-page { padding: 24px 20px; }
          .cp-hero__img { width: 64px; height: 64px; }
          .cp-hero__title { font-size: 19px; }
        }
        @media (max-width: 768px) {
          .cp-page { padding-bottom: 96px; }
        }
      `}</style>
    </div>
  );
}
