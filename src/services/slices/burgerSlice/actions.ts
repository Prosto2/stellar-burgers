import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi, orderBurgerApi } from '@api';

export const getIngredients = createAsyncThunk<TIngredient[], void>(
  'burger/fetchIngredients',
  async () => await getIngredientsApi()
);

export const OrderBurger = createAsyncThunk(
  'burger/fetchOrderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);
