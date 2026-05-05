import { useState } from "react";
import { Form, Input, Button } from "antd";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Icon } from "../../components/ui/Icon";
import bannerImg from "../../assets/images/reset-password.png";
import { REQUIRE_MESSAGE } from "../../libs/constance";
import type {
  ChangePasswordPayload,
  ChangePasswordValues,
} from "../../types/auth";
import { useAppSelector } from "../../hooks/auth";
import authApi from "../../api/features/auth";
import { AppAlert } from "../../components/ui/AppAlert";
import { useTranslation } from "../../hooks/useTranslation";

export default function ChangePassword() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const [form] = Form.useForm<ChangePasswordValues>();
  const [loading, setLoading] = useState(false);

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

  const labelCls =
    "text-[13px] font-semibold mb-1.5 transition-colors duration-300 " +
    "text-slate-500/90 dark:text-white/55";

  return (
    <div
      className="
        w-full h-full min-h-full flex items-center justify-center box-border
        max-[768px]:items-center max-[768px]:pb-24
        max-[480px]:pb-24
      "
      style={{ padding: "24px" }}
    >
      {/* Card */}
      <div
        className="
          w-full max-w-225 flex flex-row overflow-hidden rounded-3xl
          min-h-130
          shadow-[0_8px_40px_rgba(15,37,68,0.12)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.4)]
          animate-[cp-rise_0.38s_cubic-bezier(0.22,1,0.36,1)_both]
          max-[768px]:flex-col max-[768px]:min-h-[unset] max-[768px]:rounded-[20px]
        "
      >
        {/* ── LEFT decorative panel ── */}
        <div
          className="
            flex-[0_0_42%] relative overflow-hidden flex items-center justify-center
            bg-[linear-gradient(145deg,#1a3a6e_0%,#2563eb_60%,#3b82f6_100%)]
            dark:bg-[linear-gradient(145deg,#0f2544_0%,#1a3a6e_60%,#1e429f_100%)]
            max-[768px]:flex-none max-[768px]:flex-row max-[768px]:items-center
          "
          style={{ padding: "40px 36px" }}
        >
          {/* Deco circles */}
          <div
            className="absolute -top-15 -right-15 w-55 h-55 bg-[rgba(255,255,255,0.08)] rounded-full pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -left-10 w-65 h-65 bg-[rgba(255,255,255,0.05)] rounded-full pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div
            className="
              relative z-1 flex flex-col items-center gap-4
              max-[768px]:flex-row max-[768px]:flex-wrap max-[768px]:items-center max-[768px]:gap-3
            "
          >
            <img
              src={bannerImg}
              alt="Đổi mật khẩu"
              className="w-20 h-20 object-contain select-none max-[768px]:w-12 max-[768px]:h-12"
              draggable={false}
            />
            <h2
              className="
                text-[24px] font-bold font-['DM_Sans',sans-serif] text-white m-0
                tracking-[-0.3px] leading-[1.2]
                max-[768px]:text-[17px] max-[768px]:flex-1
              "
            >
              {t("doiMatKhau")}
            </h2>
          </div>
        </div>

        {/* ── RIGHT form panel ── */}
        <div
          className="
            flex-1 flex flex-col items-center justify-center
            bg-gray-300/50 dark:bg-[rgba(15,27,48,0.85)]
            transition-colors duration-300
            max-[768px]:items-center p-10
          "
        >
          <div className="w-full max-w-90">
            <div className="mb-7">
              <h1
                className="
                  text-[20px] font-bold font-['DM_Sans',sans-serif] m-0 text-center
                  transition-colors duration-300
                  text-[#0f2544] dark:text-white/92
                "
              >
                {t("doiMatKhau")} !
              </h1>
            </div>

            <Form
              form={form}
              onFinish={handleFinish}
              layout="vertical"
              requiredMark={false}
              className="fp-form w-full"
              autoComplete="off"
            >
              <div className="flex flex-col mb-1">
                <label className={labelCls}>{t("matKhauCu")}</label>
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
                <label className={labelCls}>{t("matKhauMoi")}</label>
                <Form.Item
                  name="newPassword"
                  rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
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
                <label className={labelCls}>{t("xacNhanMatKhau")}</label>
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

              <Form.Item className="mb-0">
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
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cp-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
