import { useState } from "react";
import ThirteenthSalary from "./ThirteenthSalary";

export default function ThirteenthSalaryPage() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="w-full min-h-full flex flex-col box-border overflow-x-hidden">
      <ThirteenthSalary
        revealed={revealed}
        onToggleReveal={() => setRevealed((v) => !v)}
      />
    </div>
  );
}
