import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';
import { getFeedsApi } from '@api';
import { RootState } from '../services/store';

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

// export const selectIngredientsByOrderId =
//   (orderId: string) => (state: RootState) => {
//     const order = state.feed.orders.find((order) => order._id === orderId);
//
//     if (!order) {
//       throw new Error(`Заказ с id: ${orderId} не найден`);
//     }
//
//     const ingredients = order.ingredients.map((ingredientID) =>
//       state.burger.ingredients.find(
//         (ingredient) => ingredient._id === ingredientID
//       )
//     );
//
//     const validIngredients = ingredients.filter(
//       (ingredient): ingredient is TIngredient => ingredient !== undefined
//     );
//
//     if (validIngredients.length === 0) {
//       throw new Error(`Ингредиенты заказа с id: ${orderId} не найдены`);
//     }
//
//     return validIngredients;
//   };

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectTotals: (sliceState) => ({
      total: sliceState.total,
      totalToday: sliceState.totalToday
    })
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
  }
});

export const { selectOrders, selectTotals } = feedSlice.selectors;

export const {} = feedSlice.actions;
export default feedSlice.reducer;
