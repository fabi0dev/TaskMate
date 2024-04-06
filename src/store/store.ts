import { combineReducers, configureStore } from "@reduxjs/toolkit";
import favorites from "./reducers/favorites";
import localforage from "localforage";
import { persistReducer, persistStore } from "redux-persist";

const currencyPersistConfig = {
  key: "myapp",
  storage: localforage,
  safelist: ["favorites"],
};

const all = combineReducers({
  favorites,
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
