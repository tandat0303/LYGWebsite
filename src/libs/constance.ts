import vnFlag from "../assets/flags/vn.svg";
import enFlag from "../assets/flags/gb.svg";
import mmFlag from "../assets/flags/mm.svg";
import twFlag from "../assets/flags/tw.svg";
import type { Lang } from "../types/storage";

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
