// // store/slices/vehicleSlice.ts
// import {
//   createAsyncThunk,
//   createSlice,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import type { RootState } from "../store/store";
// import userApi from "../api/user";

// export interface VehicleItem {
//   Name_Vehicle: string;
//   Name_Vehicle_VN: string;
//   Name_Vehicle_CN: string;
//   Name_Vehicle_MM: string;
// }

// interface VehicleState {
//   byFactory: Record<string, VehicleItem[]>;
//   currentFactory: string | null;
//   loading: boolean;
//   loaded: boolean;
//   error: string | null;
//   lastFetched: Record<string, number>;
// }

// const initialState: VehicleState = {
//   byFactory: {},
//   currentFactory: null,
//   loading: false,
//   loaded: false,
//   error: null,
//   lastFetched: {},
// };

// const CACHE_TTL = 1000 * 60 * 60 * 12; // 12h

// export const fetchVehicles = createAsyncThunk<
//   { factory: string; data: VehicleItem[] },
//   string,
//   { state: RootState }
// >(
//   "vehicle/fetchVehicles",
//   async (factory) => {
//     const res = await userApi.getNameVehicle(factory);

//     return {
//       factory,
//       data: res,
//     };
//   },
//   {
//     condition: (factory, { getState }) => {
//       const state = getState();
//       const vehicle = state.vehicle as any;

//       const cached = vehicle.byFactory[factory];
//       const lastFetched = vehicle.lastFetched[factory];

//       if (!cached || !lastFetched) return true;

//       const stillValid = Date.now() - lastFetched < CACHE_TTL;

//       if (stillValid) return false;

//       return true;
//     },
//   },
// );

// const vehicleSlice = createSlice({
//   name: "vehicle",
//   initialState,
//   reducers: {
//     setCurrentFactory(state, action: PayloadAction<string>) {
//       state.currentFactory = action.payload;
//       state.loaded = !!state.byFactory[action.payload];
//     },

//     resetVehicle(state) {
//       state.byFactory = {};
//       state.currentFactory = null;
//       state.loading = false;
//       state.loaded = false;
//       state.error = null;
//       state.lastFetched = {};
//     },

//     clearVehicleByFactory(state, action: PayloadAction<string>) {
//       delete state.byFactory[action.payload];
//       delete state.lastFetched[action.payload];
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchVehicles.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(fetchVehicles.fulfilled, (state, action) => {
//         const { factory, data } = action.payload;

//         state.loading = false;
//         state.loaded = true;
//         state.currentFactory = factory;
//         state.byFactory[factory] = data;
//         state.lastFetched[factory] = Date.now();
//       })

//       .addCase(fetchVehicles.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Fetch vehicle failed";
//       });
//   },
// });

// export const { resetVehicle, setCurrentFactory, clearVehicleByFactory } =
//   vehicleSlice.actions;

// export default vehicleSlice.reducer;

// /* selectors */
// export const selectVehicleState = (state: RootState) => state.vehicle;

// export const selectCurrentVehicles = (state: RootState) => {
//   const factory = state.vehicle.currentFactory;
//   if (!factory) return [];
//   return state.vehicle.byFactory[factory] || [];
// };

// export const selectVehiclesByFactory =
//   (factory: string) => (state: RootState) =>
//     state.vehicle.byFactory[factory] || [];
