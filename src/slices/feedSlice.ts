import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

interface TIngredientsList {
  orders: TOrder[];
  orderData: TOrder | null;
  total: number;
  totalToday: number;
}

const initialState: TIngredientsList = {
  orders: [],
  orderData: null,
  total: 0,
  totalToday: 0
};

export const fetchOrders = createAsyncThunk(
  'feed/fetchOrders',
  async () => await getFeedsApi()
);

export const fetchGetOrderByNumber = createAsyncThunk(
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
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchGetOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
      });
  }
});

export const { selectOrders, selectTotals, selectOrderData } =
  feedSlice.selectors;

export const {} = feedSlice.actions;
export default feedSlice.reducer;
