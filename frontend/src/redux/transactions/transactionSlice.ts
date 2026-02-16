import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTransactions,
  deleteTransaction,
  addTransaction,
  editTransaction,
} from "./transactionThunks";
import { TransactionState } from "./types";

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  transactionId: null,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setTransactionId(state, action: PayloadAction<string | null>) {
      state.transactionId = action.payload;
    },
    resetState(state) {
      state.transactions = [];
      state.loading = false;
      state.error = null;
      state.currentPage = 1;
      state.hasMore = true;
      state.transactionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const newTransactions = action.payload.transactions;
        const combinedData = [...state.transactions, ...newTransactions];
        const uniqueData = combinedData.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t._id === item._id),
        );
        state.transactions = uniqueData;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== id,
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete transaction";
      })
      // Add Transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const newTransaction = action.payload;
        state.transactions.push(newTransaction);
        state.transactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add transaction";
      })
      // Edit Transaction
      .addCase(editTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const { updatedTransaction } = action.payload;
        state.transactions = state.transactions.map((transaction) =>
          transaction._id === updatedTransaction._id
            ? updatedTransaction
            : transaction,
        );
        state.transactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      })
      .addCase(editTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to edit transaction";
      });
  },
});

export const {
  setLoading,
  setCurrentPage,
  setTransactionId,
  resetState,
} = transactionSlice.actions;

export default transactionSlice.reducer;
