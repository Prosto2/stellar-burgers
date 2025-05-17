import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

interface TIngredientsList {
  orders: TOrder[];
  orderData: TOrder | null;
  total: number;
  totalToday: number;
  errorText: string;
}

const initialState: TIngredientsList = {
  orders: [],
  orderData: null,
  total: 0,
  totalToday: 0,
  errorText: ''
};

export const getFeeds = createAsyncThunk(
  'feed/fetchOrders',
  async () => await getFeedsApi()
);

export const GetOrderByNumber = createAsyncThunk(
  'feed/fetchGetOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectTotals: (sliceState) => ({
      total: sliceState.total,
      totalToday: sliceState.totalToday
    }),
    selectOrderData: (sliceState) => sliceState.orderData
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.rejected, (state, action) => {
        state.errorText = action.error.message || '';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(GetOrderByNumber.rejected, (state, action) => {
        state.errorText = action.error.message || '';
      })
      .addCase(GetOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
      });
  }
});

export const { selectOrders, selectTotals, selectOrderData } =
  feedSlice.selectors;

export const {} = feedSlice.actions;
export default feedSlice.reducer;
