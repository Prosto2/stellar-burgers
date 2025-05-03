import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

interface TIngredientsList {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

const initialState: TIngredientsList = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const fetchOrders = createAsyncThunk<TIngredientsList, void>(
  'feed/fetchOrders',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (sliceState) => sliceState.orders
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
  }
});

export const { selectOrders } = feedSlice.selectors;

export const {} = feedSlice.actions;
export default feedSlice.reducer;
