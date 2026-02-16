import api from "../../api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setTransactionId,
} from "./transactionSlice";
import { changeBalance, editBalance } from "../user/userSlice";
import {
  FetchTransactionsParams,
  DeleteTransactionParams,
  AddTransactionParams,
  EditTransactionParams,
} from "./types";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async ({ page = 1, limit = 10, userId }: FetchTransactionsParams) => {
    const response = await api.get("/home", {
      params: {
        limit,
        offset: (page - 1) * limit,
        userId,
      },
    });

    return {
      transactions: response.data.data.transactions,
      hasMore: response.data.data.transactions.length >= limit,
    };
  }
);

export const deleteTransaction = createAsyncThunk(
  "transaction/deleteTransaction",
  async ({ id, userId }: DeleteTransactionParams, { dispatch }) => {
    const response = await api.delete(`/home/${id}`, {
      params: { userId },
    });
    
    if (response.status === 200) {
      const transaction = response.data.data.transaction;
      if (transaction) {
        dispatch(
          changeBalance({
            amount: transaction.amount,
            type: transaction.type === "income" ? "minus" : "plus",
          }),
        );
      }
      dispatch(setTransactionId(null));
      return { id, transaction };
    }
    throw new Error("Failed to delete transaction");
  }
);

export const addTransaction = createAsyncThunk(
  "transaction/addTransaction",
  async (transactionData: AddTransactionParams, { dispatch }) => {
    const response = await api.post("/home", transactionData);
    
    if (response.status === 201) {
      const newTransaction = response.data.data.transaction;
      if (newTransaction) {
        dispatch(
          changeBalance({
            amount: newTransaction.amount,
            type: newTransaction.type === "income" ? "plus" : "minus",
          }),
        );
      }
      return newTransaction;
    }
    throw new Error("Failed to add transaction");
  }
);

export const editTransaction = createAsyncThunk(
  "transaction/editTransaction",
  async ({ id, userId, updatedTransaction }: EditTransactionParams, { dispatch }) => {
    const response = await api.put(`/home/${id}`, updatedTransaction, {
      params: { userId },
    });
    
    if (response.status === 200) {
      const newTransaction = response.data.data.updatedTransaction;
      const oldTransaction = response.data.data.oldTransaction;
      
      if (newTransaction && oldTransaction) {
        dispatch(
          editBalance({
            oldamount: oldTransaction.amount,
            newamount: newTransaction.amount,
            type: newTransaction.type,
          }),
        );
      }
      dispatch(setTransactionId(null));
      return { updatedTransaction: newTransaction, oldTransaction };
    }
    throw new Error("Failed to edit transaction");
  }
);
