import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';

export const getFeeds = createAsyncThunk(
  'feed/fetchOrders',
  async () => await getFeedsApi()
);

export const GetOrderByNumber = createAsyncThunk(
  'feed/fetchGetOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);
