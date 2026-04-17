import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface SidebarContextType {
  isOpen: boolean; // mobile: overlay open/close
  isCollapsed: boolean; // desktop: thu gọn/mở rộng
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const DESKTOP_BP = 1024;

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth > DESKTOP_BP) {
      setIsCollapsed((prev) => !prev);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > DESKTOP_BP) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, isCollapsed, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};
