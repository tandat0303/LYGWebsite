import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { HeroSection } from '../components/HeroSection';
import { FeatureCards } from '../components/FeatureCards';
import { BottomNavigation } from '../components/BottomNavigation';

export default function Home() {
  return (
    <div className="home-wrapper">
      <Header />
      <div className="home-layout">
        <Sidebar />
        <main className="home-main">
          <div className="home-content">
            <HeroSection />
            <FeatureCards />
          </div>
        </main>
      </div>
      <BottomNavigation />

      <style>{`
        .home-wrapper {
          width: 100%;
          min-height: 100vh;
          background: var(--page-bg);
          color: var(--page-text);
          transition: background 0.3s ease, color 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .dark .home-wrapper {
          --page-bg: linear-gradient(135deg, #0f1b2e 0%, #1a2f4d 100%);
          --page-text: rgba(255, 255, 255, 0.9);
        }

        .light .home-wrapper {
          --page-bg: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          --page-text: var(--primary);
        }

        .home-layout {
          display: flex;
          flex: 1;
          width: 100%;
          overflow: hidden;
        }

        .home-main {
          flex: 1;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        .home-content {
          width: 100%;
          padding: 32px 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Tablet & below - hide sidebar, stack vertically */
        @media (max-width: 1024px) {
          .home-layout {
            flex-direction: column;
          }

          .home-content {
            padding: 24px 20px;
            gap: 24px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .home-wrapper {
            padding-bottom: 80px;
          }

          .home-content {
            padding: 20px 16px;
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .home-content {
            padding: 16px 12px;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
