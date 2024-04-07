import { combineReducers, configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
import { persistReducer, persistStore } from "redux-persist";
import { default as slices } from "./reducers";

const currencyPersistConfig = {
  key: "myapp",
  storage: localforage,
  safelist: ["tasks"],
};

const all = combineReducers({
  ...slices,
});

const reducers = persistReducer(currencyPersistConfig, all);

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);
export { store, persistor };
