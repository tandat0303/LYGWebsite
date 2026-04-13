import type { AuthPayload } from "../types/auth";
import type { User } from "./../types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },

    hydrateAuth(state, action: PayloadAction<AuthPayload | null>) {
      if (action.payload) {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      } else {
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
      }

      state.isHydrated = true;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(loginThunk.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(
  //       loginThunk.fulfilled,
  //       (
  //         state,
  //         action: PayloadAction<{ token: string; user: AuthState["user"] }>,
  //       ) => {
  //         state.loading = false;
  //         state.token = action.payload.token;
  //         state.user = action.payload.user;
  //       },
  //     )
  //     .addCase(loginThunk.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload ?? "Unknown error";
  //     });
  // },
});

export const { setToken, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
