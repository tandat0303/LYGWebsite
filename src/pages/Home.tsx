import { HeroSection } from "../components/layout/HeroSection";
import { FeatureCards } from "../components/layout/FeatureCards";

export default function Home() {
  return (
    <div
      className="w-full flex flex-col gap-8"
      style={{ padding: "32px 40px" }}
    >
      <HeroSection />
      <FeatureCards />
    </div>
  );
}
