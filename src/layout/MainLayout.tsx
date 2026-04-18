import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { BottomNavigation } from "../components/BottomNavigation";

export default function MainLayout() {
  return (
    <div className="home-wrapper w-full h-screen overflow-hidden transition-colors duration-300 ease-[ease]">
      <div className="flex w-full h-full">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          <Header />
          <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {/* Children Route */}
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNavigation />

      <style>{`
        .home-wrapper {
          background: var(--page-bg);
          color: var(--page-text);
        }
        .dark .home-wrapper {
          --page-bg: linear-gradient(135deg, #0f1b2e 0%, #1a2f4d 100%);
          --page-text: rgba(255, 255, 255, 0.9);
        }
        .light .home-wrapper {
          --page-bg: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          --page-text: var(--primary);
        }
        @media (max-width: 768px) {
          .home-wrapper { padding-bottom: 80px; }
        }
      `}</style>
    </div>
  );
}
