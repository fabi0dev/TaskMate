import { createSlice } from "@reduxjs/toolkit";

interface FavoritesProps {}
const initialState = {};

export const slice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setData: (state, { payload }) => {
      return {
        ...state,
        welcomeLinkedIn: payload,
      };
    },
  },
});

export const { setData } = slice.actions;
export default slice.reducer;
export const selectorToasts = (state: {
  toasts: FavoritesProps;
}): FavoritesProps => state.toasts;
