import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import {
  setIsAuth,
  setError,
  setLoading,
  setUser,
  setToken,
  setRefreshToken,
  setBalance,
  resetUserState,
} from "../user/userSlice";
import { resetState } from "../transactions/transactionSlice";
import { resetCurrency } from "../currency/currencySlice";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/register", userData);
      const { token, refreshToken, email, name, id, balance } =
        response.data.data;
      return response.data.data;
    } catch (error) {
      if(error.response?.status === 409) {
         return rejectWithValue("Email already in use");
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", userData);
      const { token, refreshToken, email, name, id, balance } = response.data.data;
      return { 
        user: { email, name, id }, 
        token, 
        refreshToken, 
        balance 
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Invalid email or password");
      }
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { dispatch, getState }) => {
    const { user } = getState().session;
    const { token, refreshToken } = getState().session;
    try {
      await api.post("/logout", {
        id: user.id,
        token: token,
        refreshToken: refreshToken,
      });
      return true;
    } catch (error) {
      console.error("Error logging out user:", error);
      return false;
    } finally {
      dispatch(resetUserState());
      dispatch(resetState());
      dispatch(resetCurrency());
    }
  }
);
