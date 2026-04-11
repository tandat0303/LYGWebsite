export const Icon = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: "flex",
      alignItems: "center",
      color: "rgba(147,197,253,0.8)",
      marginRight: 2,
    }}
  >
    {children}
  </span>
);
