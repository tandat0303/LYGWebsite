import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LANGS } from "../libs/constance";
import type { Lang } from "../types/storage";
import type { AppDispatch } from "../store/store";
import { applyLanguage } from "./translationSlice";

const STORAGE_KEY = "language";

const getSavedLang = (): Lang => {
  const savedCode = localStorage.getItem(STORAGE_KEY);
  return LANGS.find((l) => l.code === savedCode) ?? LANGS[0];
};

interface LanguageState {
  current: Lang;
}

const initialState: LanguageState = {
  current: getSavedLang(),
};

const languageSlice = createSlice({
  name: "language",
  initialState: initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Lang>) {
      state.current = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload.code);
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export const changeLanguage = (lang: Lang) => (dispatch: AppDispatch) => {
  dispatch(setLanguage(lang));
  dispatch(applyLanguage(lang.code));
};

export default languageSlice.reducer;
