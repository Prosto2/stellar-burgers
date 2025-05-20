import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi, orderBurgerApi } from '@api';

export const getIngredients = createAsyncThunk<TIngredient[], void>(
  'burger/fetchIngredients',
  async () => {
    const response = await getIngredientsApi();
    console.log('Данные из запроса:', response);
    return response;
  }
);

export const OrderBurger = createAsyncThunk(
  'burger/fetchOrderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);
