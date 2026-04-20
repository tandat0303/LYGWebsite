export type SidebarIcon = string | React.ReactNode | React.ElementType;

interface SidebarMenuItem {
  id: string;
  label: string;
  icon: SidebarIcon;
  onClick?: () => void;
}

export interface SidebarSection {
  title: string;
  items: SidebarMenuItem[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: SidebarIcon;
  onClick?: () => void;
}
