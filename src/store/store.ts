import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import storage from "../libs/storage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();

  const { accessToken, user } = state.auth;

  if (accessToken && user) {
    storage.set("auth", {
      accessToken,
      user: user,
    });
  } else {
    storage.remove("auth");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import authReducer from "../features/authSlice";
// import vehicleReducer from "../features/vehicleSlice";
// import storage from "redux-persist/lib/storage";

// const vehiclePersistConfig = {
//   key: "vehicle",
//   storage,
//   whitelist: ["byFactory", "lastFetched", "currentFactory"],
// };

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     vehicle: persistReducer(vehiclePersistConfig, vehicleReducer),
//   },
// });

// // store.subscribe(() => {
// //   const state = store.getState();

// //   const { accessToken, user } = state.auth;

// //   if (accessToken && user) {
// //     storage.set("auth", {
// //       accessToken,
// //       user: user,
// //     });
// //   } else {
// //     storage.remove("auth");
// //   }
// // });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
