import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface AuthState {
  user: { id: string; email: string; name: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  idNumber: string;
  password: string;
}

export const loginThunk = createAsyncThunk<
  { token: string; user: AuthState["user"] },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    // Mock
    await new Promise((r) => setTimeout(r, 1000));
    if (credentials.password === "wrong")
      throw new Error("Invalid credentials");
    return {
      token: "mock-jwt-token",
      user: { id: "1", email: credentials.idNumber, name: "User" },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur de connexion";
    return rejectWithValue(message);
  }
});

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ token: string; user: AuthState["user"] }>,
        ) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
        },
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
