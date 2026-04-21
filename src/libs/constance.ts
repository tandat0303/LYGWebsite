import vnFlag from "../assets/flags/vn.svg";
import enFlag from "../assets/flags/gb.svg";
import mmFlag from "../assets/flags/mm.svg";
import twFlag from "../assets/flags/tw.svg";
import type { Lang } from "../types/storage";
import type { NavItem } from "../types/sidebar";
import { PiCreditCard } from "react-icons/pi";
import { RiContactsBook3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { RiHome3Line } from "react-icons/ri";
import type { FieldKey } from "../types/user";

export const ROUTE_MAP: Record<string, string> = {
  home: "/",
  "change-pass": "/change-password",
  info: "/user-info",
  guide: "/guide",
};

export const REQUIRE_MESSAGE = "Please do not leave it blank";

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
  "temporaryAddress",
];
export const EDITABLE_FIELDS: FieldKey[] = [
  "birthday",
  "phone",
  "idCard",
  "idIssueDate",
  "transport",
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
  {
    id: "settings",
    label: "caiDat",
    icon: IoSettingsOutline,
  },
];
