import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import translationApi from "../api/translation";
import type { TranslationMap, TranslationResponse } from "../types/translation";

export const fetchTranslations = createAsyncThunk(
  "translation/fetchTranslations",
  async (_, { rejectWithValue }) => {
    try {
      const data = await translationApi.getLanguages();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data ?? "Failed to load translations",
      );
    }
  },
);

interface TranslationState {
  all: TranslationResponse;
  current: TranslationMap;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TranslationState = {
  all: {},
  current: {},
  status: "idle",
  error: null,
};

const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    applyLanguage(state, action: PayloadAction<string>) {
      const langCode = action.payload;
      if (state.all[langCode]) {
        state.current = state.all[langCode];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTranslations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchTranslations.fulfilled,
        (state, action: PayloadAction<TranslationResponse>) => {
          state.status = "succeeded";
          state.all = action.payload;

          const savedCode = localStorage.getItem("language") ?? "vi";
          state.current =
            action.payload[savedCode] ?? action.payload["vi"] ?? {};
        },
      )
      .addCase(fetchTranslations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { applyLanguage } = translationSlice.actions;
export default translationSlice.reducer;
