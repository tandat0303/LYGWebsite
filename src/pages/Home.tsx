import { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function Home() {
  const [activeKey, setActiveKey] = useState("home");

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <Header />

      <main className="pt-16 md:pt-20 pb-24 md:pb-8 overflow-x-hidden">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-8">
          {/* Greeting Card */}
          <div
            className="rounded-2xl border p-6 md:p-8"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-card)",
            }}
          >
            <p
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Xin chào
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Trương Tấn Đạt
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Hồ Chí Minh · LYV
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              { label: "Quỹ thời gian", value: "07:32", sub: "Hôm nay" },
              { label: "Ngày nghỉ", value: "5", sub: "Còn lại" },
              { label: "Tăng ca", value: "8h", sub: "Tháng này" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 md:p-6 text-center"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-card)",
                }}
              >
                <p
                  className="text-xs md:text-sm font-semibold mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{ color: "var(--accent)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs md:text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div>
            <h2
              className="text-sm font-bold tracking-wide uppercase mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Chức năng chính
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {[
                { icon: "⏱️", label: "Chấm công" },
                { icon: "🎯", label: "Lương" },
                { icon: "📋", label: "Nghỉ phép" },
                { icon: "📊", label: "Báo cáo" },
                { icon: "💬", label: "Thông báo" },
                { icon: "⚙️", label: "Cài đặt" },
              ].map((feature, i) => (
                <button
                  key={i}
                  onClick={() => setActiveKey(feature.label)}
                  className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-card)",
                  }}
                >
                  <div className="text-2xl md:text-3xl">{feature.icon}</div>
                  <span
                    className="text-xs md:text-sm font-medium text-center"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {feature.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h2
              className="text-sm font-bold tracking-wide uppercase mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Hoạt động gần đây
            </h2>
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-card)",
              }}
            >
              {[
                {
                  label: "Bảng lương tháng 4 đã được cập nhật",
                  time: "2 phút trước",
                  color: "#10b981",
                },
                {
                  label: "Yêu cầu tăng ca ngày 12/04 được duyệt",
                  time: "1 giờ trước",
                  color: "#8b5cf6",
                },
                {
                  label: "Ngày nghỉ phép: còn 5 ngày trong năm",
                  time: "Hôm qua",
                  color: "#f59e0b",
                },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors duration-150 ${
                    i < arr.length - 1 ? "border-b" : ""
                  } hover:bg-white/[0.02]`}
                  style={{
                    borderColor:
                      i < arr.length - 1 ? "var(--border-card)" : "transparent",
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.label}
                    </p>
                  </div>
                  <p
                    className="text-xs flex-shrink-0 whitespace-nowrap"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeKey={activeKey} onNavigate={setActiveKey} />
    </div>
  );
}
