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
import { useTranslation } from "../../hooks/useTranslation";

export default function ChangePassword() {
  const { t } = useTranslation();

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
        AppAlert({ icon: "success", title: t(res.message) });
        form.resetFields();
      } else {
        AppAlert({ icon: "error", title: t(res.message) });
      }
    } catch (error) {
      if (!error?.response?.status) {
        AppAlert({ icon: "error", title: t(error?.response?.message) });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-page">
      <div className="cp-layout">
        {/* ── LEFT decorative panel ── */}
        <div className="cp-left">
          <div className="cp-left__deco1" aria-hidden="true" />
          <div className="cp-left__deco2" aria-hidden="true" />
          <div className="cp-left__content">
            <img
              src={bannerImg}
              alt="Đổi mật khẩu"
              className="cp-left__img"
              draggable={false}
            />
            <h2 className="cp-left__title">{t("doiMatKhau")}</h2>
            {/* <p className="cp-left__desc">
              Bảo vệ tài khoản của bạn bằng cách cập nhật mật khẩu thường xuyên
            </p>
            <ul className="cp-left__tips">
              <li>Ít nhất 8 ký tự</li>
              <li>Kết hợp chữ hoa, chữ thường và số</li>
              <li>Không dùng thông tin cá nhân</li>
            </ul> */}
          </div>
        </div>

        {/* ── RIGHT form panel ── */}
        <div className="cp-right">
          <div className="cp-form-header">
            <h1 className="cp-form-header__title">{t("doiMatKhau")} !</h1>
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
                {t("matKhauCu")}
              </label>
              <Form.Item
                name="password"
                rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
              >
                <Input.Password
                  prefix={
                    <Icon>
                      <KeyRound size={15} />
                    </Icon>
                  }
                  placeholder={t("matKhauCu")}
                  size="large"
                />
              </Form.Item>
            </div>

            <div className="flex flex-col mb-1">
              <label className="text-[13px] font-semibold mb-1.5 transition-colors duration-300 ease-[ease] cp-label">
                {t("matKhauMoi")}
              </label>
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: t(REQUIRE_MESSAGE) },
                  // { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  prefix={
                    <Icon>
                      <ShieldCheck size={15} />
                    </Icon>
                  }
                  placeholder={t("matKhauMoi")}
                  size="large"
                />
              </Form.Item>
            </div>

            <div className="flex flex-col mb-1">
              <label className="text-[13px] font-semibold mb-1.5 transition-colors duration-300 ease-[ease] cp-label">
                {t("xacNhanMatKhau")}
              </label>
              <Form.Item
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: t(REQUIRE_MESSAGE) },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value)
                        return Promise.resolve();
                      return Promise.reject(
                        new Error(t("matKhauXacNhanKhongKhop")),
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
                  placeholder={t("nhapLaiMatKhauMoi")}
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
                {t("doiMatKhau")}
              </Button>
            </Form.Item>
          </Form>
          {/* )} */}
        </div>
        {/* /cp-right */}
      </div>
      {/* /cp-layout */}

      <style>{`
        @keyframes cp-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Page ── */
        .cp-page {
          width: 100%;
          height: 100%;
          min-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }

        /* ── Two-column layout ── */
        .cp-layout {
          width: 100%;
          max-width: 900px;
          min-height: 520px;
          display: flex;
          flex-direction: row;
          border-radius: 24px;
          overflow: hidden;
          animation: cp-rise 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: box-shadow 0.3s;
        }
        .dark .cp-layout  { box-shadow: 0 24px 64px rgba(0,0,0,0.4); }
        .light .cp-layout { box-shadow: 0 8px 40px rgba(15,37,68,0.12); }

        /* ── Left decorative panel (1/2) ── */
        .cp-left {
          flex: 0 0 42%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 36px;
        }
        .dark .cp-left  { background: linear-gradient(145deg, #0f2544 0%, #1a3a6e 60%, #1e429f 100%); }
        .light .cp-left { background: linear-gradient(145deg, #1a3a6e 0%, #2563eb 60%, #3b82f6 100%); }

        /* Blurry circle accents */
        .cp-left__deco1 {
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          pointer-events: none;
        }
        .cp-left__deco2 {
          position: absolute;
          bottom: -80px; left: -40px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          pointer-events: none;
        }

        .cp-left__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .cp-left__img {
          width: 100px; height: 100px;
          object-fit: contain;
          user-select: none;
        }

        .cp-left__title {
          font-size: 24px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          margin: 0;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }

        .cp-left__desc {
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.65);
          margin: 0;
          line-height: 1.65;
        }

        .cp-left__tips {
          list-style: none;
          padding: 0; margin: 4px 0 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cp-left__tips li {
          font-size: 12.5px;
          font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.55);
          padding-left: 16px;
          position: relative;
        }
        .cp-left__tips li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: rgba(147,197,253,0.8);
          font-size: 11px;
          top: 1px;
        }

        /* ── Right form panel (1/2) ── */
        .cp-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          transition: background 0.3s;
        }
        .cp-right > * {
          width: 100%;
          max-width: 360px;
        }
        .dark .cp-right  { background: rgba(15,27,48,0.85); }
        .light .cp-right { background: #fff; }

        .cp-form-header {
          margin-bottom: 28px;
        }
        .cp-form-header__title {
          font-size: 20px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          text-align: center;
          transition: color 0.3s;
        }
        .dark .cp-form-header__title  { color: rgba(255,255,255,0.92); }
        .light .cp-form-header__title { color: #0f2544; }

        .dark .cp-label  { color: rgba(255,255,255,0.55); }
        .light .cp-label { color: #475569; }

        /* Light mode form overrides */
        .light .lp-form .ant-input-affix-wrapper,
        .light .lp-form .ant-input-suffix {
          background: #f8fafc !important;
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

        /* ── Responsive ── */
        /* Tablet: stack vertically */
        @media (max-width: 768px) {
          .cp-page { padding: 16px 16px 96px; align-items: center; }
          .cp-layout { flex-direction: column; min-height: unset; border-radius: 20px; }
          .cp-left { flex: none; padding: 24px; flex-direction: row; align-items: center; }
          .cp-left__content { flex-direction: row; flex-wrap: wrap; gap: 12px; align-items: center; }
          .cp-left__img { width: 48px; height: 48px; }
          .cp-left__title { font-size: 17px; flex: 1; }
          .cp-left__desc, .cp-left__tips { display: none; }
          .cp-right { padding: 28px 24px; }
        }

        @media (max-width: 480px) {
          .cp-page { padding: 12px 12px 96px; }
          .cp-right { padding: 20px 16px; }
          .cp-left { padding: 16px 20px; }
        }
      `}</style>
    </div>
  );
}
