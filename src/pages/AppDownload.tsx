import { Button, Image } from "antd";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "../hooks/useTranslation";
import { Copy, CopyCheckIcon } from "lucide-react";
import { AppAlert } from "../components/ui/AppAlert";

export default function AppDownload() {
  const { t } = useTranslation();

  const { theme } = useTheme();

  const [qrVisible, setQrVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      AppAlert({ icon: "success", title: "Copied link to clipboard!" });
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="w-full min-h-full flex items-center justify-center box-border overflow-x-hidden p-6">
      <div
        className="w-full flex items-center justify-center gap-5 min-h-[calc(100vh-140px)]
            animate-[cp-rise_0.38s_cubic-bezier(0.22,1,0.36,1)_both]
            max-[900px]:flex-col max-[900px]:min-h-[unset] max-[900px]:gap-4
            max-[480px]:gap-3"
      >
        <div className="flex-[0_0_calc(33.333%-10px)] flex flex-col max-[900px]:flex-none max-[900px]:w-full">
          <div
            className="flex-1 rounded-[20px] flex flex-col items-center justify-center relative overflow-hidden
                transition-[background,border-color,box-shadow] duration-300
                bg-white/55 border border-slate-200 shadow-[0_4px_20px_rgba(15,37,68,0.10)]
                dark:bg-[rgba(15,27,48,0.7)] dark:border-white/7 dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                max-[900px]:flex-row max-[900px]:gap-6 max-[900px]:justify-center
                max-[600px]:flex-col max-[600px]:items-center"
            style={{ padding: "32px 24px" }}
          >
            {theme === "dark" && (
              <div
                className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full pointer-events-none
                  bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_70%)]
                  max-[900px]:hidden"
                aria-hidden="true"
              />
            )}

            <div
              className="flex flex-col items-center gap-4 w-full relative z-1
                  max-[900px]:flex-row max-[900px]:items-center max-[900px]:w-auto max-[900px]:gap-2.5
                  max-[600px]:flex-col max-[600px]:items-center"
            >
              <div
                className="rounded-2xl flex items-center justify-center
                    transition-transform duration-180ms ease-out hover:scale-[1.03]
                    bg-gray-100 border border-slate-200 dark:bg-white/6 dark:border-transparent dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                style={{ padding: "16px" }}
                title="Phóng to QR"
              >
                <Image
                  style={{ display: "none" }}
                  preview={{
                    open: qrVisible,
                    onOpenChange: (v) => setQrVisible(v),
                    imageRender: () => (
                      <div className="flex flex-col items-center gap-4">
                        <QRCodeSVG
                          value={"http://www.lacty.com.vn/ios/"}
                          size={280}
                          bgColor="#ffffff"
                          fgColor="#0f2544"
                          style={{
                            borderRadius: 12,
                            padding: 16,
                            background: "#fff",
                          }}
                        />
                        <p className="text-white text-[15px] font-semibold m-0 tracking-[0.3px]">
                          {t("taiLygChoIos")}
                        </p>
                      </div>
                    ),
                    actionsRender: () => null,
                  }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "zoom-in" }}
                  onClick={() => setQrVisible(true)}
                  onKeyDown={(e) => e.key === "Enter" && setQrVisible(true)}
                >
                  <QRCodeSVG
                    value={"http://www.lacty.com.vn/ios/"}
                    size={148}
                    bgColor="transparent"
                    fgColor="currentColor"
                    className="block transition-colors duration-300 text-slate-700 dark:text-white/90
                        w-full max-w-40 h-auto max-[900px]:max-w-[100px] max-[600px]:max-w-[130px]"
                  />
                </div>
              </div>

              <div
                className="text-center flex flex-col gap-[3px] w-full
                    max-[900px]:text-left max-[600px]:text-center"
              >
                <p className="text-[15px] font-bold m-0 leading-[1.3] transition-colors duration-300 text-slate-800 dark:text-white/92">
                  {t("taiLygChoIos")}
                </p>
              </div>
              <Button
                htmlType="submit"
                block
                className="lp-submit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy("http://www.lacty.com.vn/ios/");
                }}
              >
                {copied ? <CopyCheckIcon color="green" /> : <Copy />}
                {t("saoChepDuongDan")}
              </Button>
            </div>
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
