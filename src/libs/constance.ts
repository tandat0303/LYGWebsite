import vnFlag from "../assets/flags/vn.svg";
import enFlag from "../assets/flags/gb.svg";
import mmFlag from "../assets/flags/mm.svg";
import twFlag from "../assets/flags/tw.svg";
import type { Lang } from "../types/storage";
import type { NavItem } from "../types/sidebar";
import type { Feature } from "../types/features";
import Clock from "../assets/icons/clock.png";
import Vacation from "../assets/icons/vacations.png";
import Overtime from "../assets/icons/overtime.png";
import Salary from "../assets/icons/salary.png";
import Reward from "../assets/icons/reward.png";
import FireSalary from "../assets/icons/fire-salary.png";
import Notebook from "../assets/icons/notebook.png";
import UserInfo from "../assets/icons/user-info.png";
import Contact from "../assets/icons/contact.png";
import News from "../assets/icons/news.png";
import { PiCreditCard } from "react-icons/pi";
import { RiContactsBook3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { RiHome3Line } from "react-icons/ri";

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

export const LANGS: Lang[] = [
  { code: "vn", label: "Vietnamese", native: "Tiếng Việt", flag: vnFlag },
  { code: "en", label: "English", native: "English", flag: enFlag },
  { code: "mm", label: "Myanmar", native: "မြန်မာဘာသာ", flag: mmFlag },
  {
    code: "tw",
    label: "Taiwan",
    native: "繁體中文",
    flag: twFlag,
  },
];

export const LARGE_FEATURES: Feature[] = [
  {
    id: "quet-the",
    label: "Giờ quẹt thể",
    icon: Clock,
    description: "Quản lý giờ làm việc",
    size: "large",
    highlight: true,
  },
  {
    id: "ngay-nghi",
    label: "Ngày nghỉ",
    icon: Vacation,
    description: "Xem lịch nghỉ",
    size: "large",
    highlight: true,
  },
  {
    id: "tang-ca",
    label: "Tăng ca",
    icon: Overtime,
    description: "Yêu cầu tăng ca",
    size: "large",
    highlight: true,
  },
];

export const SMALL_FEATURES: Feature[] = [
  {
    id: "luong",
    label: "Lương",
    icon: Salary,
    size: "small",
  },
  {
    id: "thuong",
    label: "Thưởng",
    icon: Reward,
    size: "small",
  },
  {
    id: "luong-thoi-viec",
    label: "Lương thôi việc",
    icon: FireSalary,
    size: "small",
  },
  {
    id: "so-tay",
    label: "Số tay/Quy trình",
    icon: Notebook,
    size: "small",
  },
  {
    id: "ca-nhan",
    label: "Thông tin cá nhân",
    icon: UserInfo,
    size: "small",
  },
  {
    id: "lien-he",
    label: "Liên hệ",
    icon: Contact,
    size: "small",
  },
  {
    id: "ban-tin",
    label: "Bản tin",
    icon: News,
    size: "small",
  },
];

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Trang chủ",
    icon: RiHome3Line,
  },
  {
    id: "salary",
    label: "Lương",
    icon: PiCreditCard,
  },
  {
    id: "contact",
    label: "Liên hệ",
    icon: RiContactsBook3Line,
  },
  {
    id: "settings",
    label: "Cài đặt",
    icon: IoSettingsOutline,
  },
];
