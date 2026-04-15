import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeatureCards } from '../components/FeatureCards';
import { BottomNavigation } from '../components/BottomNavigation';

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <main className="home-main">
        <div className="home-content">
          <HeroSection />
          <FeatureCards />
        </div>
      </main>
      <BottomNavigation />

      <style>{`
        .home-page {
          width: 100%;
          min-height: 100vh;
          background: var(--page-bg);
          color: var(--page-text);
          transition: background 0.3s ease, color 0.3s ease;
          padding-bottom: 80px;
        }

        .dark .home-page {
          --page-bg: linear-gradient(135deg, #0f1b2e 0%, #1a2f4d 100%);
          --page-text: rgba(255, 255, 255, 0.9);
        }

        .light .home-page {
          --page-bg: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          --page-text: var(--primary);
        }

        .home-main {
          width: 100%;
          max-width: 100%;
        }

        .home-content {
          width: 100%;
          padding: 24px 16px;
          margin: 0 auto;
        }

        @media (min-width: 480px) {
          .home-content {
            padding: 24px 20px;
          }
        }

        @media (min-width: 768px) {
          .home-page {
            padding-bottom: 0;
          }

          .home-content {
            max-width: 800px;
            padding: 32px 24px;
            margin: 0 auto;
          }
        }

        @media (min-width: 1024px) {
          .home-content {
            max-width: 1000px;
            padding: 40px 32px;
          }
        }
      `}</style>
    </div>
  );
}
