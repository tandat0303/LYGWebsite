import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import userApi from "../api/user";
import type { Vehicle } from "../types/user";

export const fetchVehicles = createAsyncThunk(
  "transport/fetchVehicles",
  async (factory: string, { rejectWithValue }) => {
    try {
      const data = await userApi.getNameVehicle(factory);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data ?? "Failed to load vehicles",
      );
    }
  },
);

interface TransportState {
  vehicles: Vehicle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TransportState = {
  vehicles: [],
  status: "idle",
  error: null,
};

const transportSlice = createSlice({
  name: "transport",
  initialState: initialState,
  reducers: {
    clearVehicles(state) {
      state.vehicles = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchVehicles.fulfilled,
        (state, action: PayloadAction<Vehicle[]>) => {
          state.status = "succeeded";
          state.vehicles = action.payload;
        },
      )
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearVehicles } = transportSlice.actions;
export default transportSlice.reducer;
