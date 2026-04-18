import { HeroSection } from "../components/HeroSection";
import { FeatureCards } from "../components/FeatureCards";

export default function Home() {
  return (
    <div
      className="w-full flex flex-col gap-8"
      style={{ padding: "32px 40px" }}
    >
      <HeroSection />
      <FeatureCards />

      <style>{`
        @media (max-width: 1024px) {
          .home-content { padding: 24px 20px; gap: 24px; }
        }
        @media (max-width: 768px) {
          .home-content { padding: 20px 16px; gap: 20px; }
        }
        @media (max-width: 480px) {
          .home-content { padding: 16px 12px; gap: 16px; }
        }
      `}</style>
    </div>
  );
}
