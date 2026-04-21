import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import transportReducer, { fetchVehicles } from "../features/transportSlice";
import languageReducer from "../features/languageSlice";
import translationReducer from "../features/translationSlice";
import storage from "../libs/storage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    transport: transportReducer,
    translation: translationReducer,
  },
});

store.subscribe(() => {
  const { isHydrated, accessToken, user } = store.getState().auth;

  if (!isHydrated) return;

  if (accessToken && user) {
    storage.set("auth", { accessToken, user });
  } else {
    storage.remove("auth");
  }
});

const unsubscribeHydrate = store.subscribe(() => {
  const { isHydrated, user } = store.getState().auth;
  if (!isHydrated) return;

  unsubscribeHydrate();

  if (user?.factory) {
    store.dispatch(fetchVehicles(user.factory));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
