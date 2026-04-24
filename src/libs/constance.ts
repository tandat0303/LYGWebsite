import vnFlag from "../assets/flags/vn.svg";
import enFlag from "../assets/flags/gb.svg";
import mmFlag from "../assets/flags/mm.svg";
import twFlag from "../assets/flags/tw.svg";
import type { Lang } from "../types/storage";
import type { NavItem } from "../types/sidebar";
import { PiCreditCard } from "react-icons/pi";
import { RiContactsBook3Line } from "react-icons/ri";
// import { IoSettingsOutline } from "react-icons/io5";
import { RiHome3Line } from "react-icons/ri";
import type { FieldKey } from "../types/user";

export const ROUTE_MAP: Record<string, string> = {
  home: "/",

  info: "/user-info",

  news: "/news",

  download: "/app-download",
  "change-pass": "/change-password",
  contact: "/contact",
  note: "/note",
  guide: "/guide",
};

export const REQUIRE_MESSAGE = "vuiLongDienDayDuThongTin";

export const SLIDE_DURATION = 360;

export const FACTORY_OPTIONS = [
  { value: "LYV", label: "LYV" },
  { value: "LVL", label: "LVL" },
  { value: "LHG", label: "LHG" },
  { value: "LYM/POL", label: "LYM/POL" },
  { value: "JAZ", label: "JAZ" },
  { value: "LYN", label: "LYN" },
  { value: "LTB", label: "LTB" },
  { value: "LDT", label: "LDT" },
  { value: "JZS", label: "JZS" },
];

export const MASKED_FIELDS: FieldKey[] = [
  "birthday",
  "phone",
  "idCard",
  "idIssueDate",
  "permanentAddress",
  "transport",
  "shuttleTrip",
  "shuttleStop",
  "temporaryAddress",
];
export const EDITABLE_FIELDS: FieldKey[] = [
  "birthday",
  "phone",
  "idCard",
  "idIssueDate",
  "transport",
  "shuttleTrip",
  "shuttleStop",
  "temporaryAddress",
];

export const DATE_FIELDS: FieldKey[] = ["birthday", "idIssueDate"];

export const LANGS: Lang[] = [
  { code: "vi", label: "tiengViet", native: "Tiếng Việt", flag: vnFlag },
  { code: "en", label: "tiengAnh", native: "English", flag: enFlag },
  { code: "mm", label: "tiengMyanmar", native: "မြန်မာဘာသာ", flag: mmFlag },
  {
    code: "tw",
    label: "tiengTrung",
    native: "繁體中文",
    flag: twFlag,
  },
];

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "trangChu",
    icon: RiHome3Line,
  },
  {
    id: "salary",
    label: "luong",
    icon: PiCreditCard,
  },
  {
    id: "contact",
    label: "lienHe",
    icon: RiContactsBook3Line,
  },
  // {
  //   id: "settings",
  //   label: "caiDat",
  //   icon: IoSettingsOutline,
  // },
];

export const STATUS_META = {
  green: {
    label: "Đủ công",
    color: "#10b981",
    bgColor: "#ecfdf5",
    borderColor: "#6ee7b7",
  },
  red: {
    label: "Vắng mặt",
    color: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fca5a5",
  },
  yellow: {
    label: "Khác",
    color: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fcd34d",
  },
  empty: {
    label: "Không có dữ liệu",
    color: "#94a3b8",
    bgColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  weekend: {
    label: "Cuối tuần",
    color: "#94a3b8",
    bgColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
} as const;

export const STATUS_STYLES = {
  green: {
    bg: "bg-emerald-100 dark:bg-emerald-900/20",
    border: "border-emerald-300 dark:border-emerald-600/40",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/20",
    border: "border-red-300 dark:border-red-600/40",
    text: "text-red-700 dark:text-red-400",
  },
  yellow: {
    bg: "bg-amber-100 dark:bg-amber-900/20",
    border: "border-amber-300 dark:border-amber-600/40",
    text: "text-amber-700 dark:text-amber-400",
  },
  empty: {
    bg: "bg-slate-100 dark:bg-white/[0.03]",
    border: "border-slate-200 dark:border-white/5",
    text: "text-slate-500 dark:text-slate-600",
  },
  weekend: {
    bg: "bg-transparent",
    border: "border-transparent",
    text: "text-slate-300 dark:text-slate-700",
  },
} as const;

export const DOW_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export const monthNames = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
