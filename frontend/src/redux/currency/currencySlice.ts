import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrencyState } from "./types";

const initialState: CurrencyState = {
  midEuroRate: null,
  midGbpRate: null,
  lastFetchTime: null,
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setMidEuroRate: (state, action: PayloadAction<number>) => {
      state.midEuroRate = action.payload;
    },
    setMidGbpRate: (state, action: PayloadAction<number>) => {
      state.midGbpRate = action.payload;
    },
    setLastFetchTime: (state, action: PayloadAction<string>) => {
      state.lastFetchTime = action.payload;
    },
    resetCurrency: (state) => {
      state.midEuroRate = null;
      state.midGbpRate = null;
      state.lastFetchTime = null;
    },
  },
});

export const {
  setMidEuroRate,
  setMidGbpRate,
  setLastFetchTime,
  resetCurrency,
} = currencySlice.actions;
export default currencySlice.reducer;
