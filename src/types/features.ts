export interface Feature {
  id: string;
  label: string;
  icon: React.ReactNode | string;
  description?: string;
  size?: "large" | "small";
  highlight?: boolean;
}

export interface FeatureCardProps {
  feature: Feature;
}
