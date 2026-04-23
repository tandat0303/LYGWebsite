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
import type { AttendanceStatus } from "../types/attendance";

export const ROUTE_MAP: Record<string, string> = {
  home: "/",
  "change-pass": "/change-password",
  info: "/user-info",
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

export const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    shortLabel: string;
    dotClass: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  present: {
    label: "Đúng giờ",
    shortLabel: "Đ",
    dotClass: "bg-emerald-500 dark:bg-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-200 dark:border-emerald-700/50",
  },
  late: {
    label: "Đi trễ",
    shortLabel: "T",
    dotClass: "bg-amber-500 dark:bg-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-900/30",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-200 dark:border-amber-700/50",
  },
  absent: {
    label: "Vắng mặt",
    shortLabel: "V",
    dotClass: "bg-red-500 dark:bg-red-400",
    bgClass: "bg-red-50 dark:bg-red-900/30",
    textClass: "text-red-700 dark:text-red-300",
    borderClass: "border-red-200 dark:border-red-700/50",
  },
  holiday: {
    label: "Nghỉ lễ",
    shortLabel: "L",
    dotClass: "bg-purple-500 dark:bg-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-900/30",
    textClass: "text-purple-700 dark:text-purple-300",
    borderClass: "border-purple-200 dark:border-purple-700/50",
  },
  leave: {
    label: "Nghỉ phép",
    shortLabel: "P",
    dotClass: "bg-sky-500 dark:bg-sky-400",
    bgClass: "bg-sky-50 dark:bg-sky-900/30",
    textClass: "text-sky-700 dark:text-sky-300",
    borderClass: "border-sky-200 dark:border-sky-700/50",
  },
  overtime: {
    label: "Tăng ca",
    shortLabel: "TC",
    dotClass: "bg-blue-600 dark:bg-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-900/30",
    textClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-200 dark:border-blue-700/50",
  },
  weekend: {
    label: "Cuối tuần",
    shortLabel: "",
    dotClass: "bg-slate-300 dark:bg-slate-600",
    bgClass: "bg-transparent",
    textClass: "text-slate-400 dark:text-slate-600",
    borderClass: "border-transparent",
  },
};

export const DOW_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
