import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../../utils/cookie';
import { userLogout } from './userSlice';

export const getUser = createAsyncThunk('user/fetchUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const registerUser = createAsyncThunk(
  'user/fetchRegister',
  async ({ email, name, password }: TRegisterData) => {
    const data = await registerUserApi({ email, name, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/fetchLogin',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear();
        deleteCookie('accessToken');
        dispatch(userLogout());
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);

export const UpdateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async ({ email, name, password }: TRegisterData) => {
    const data = await updateUserApi({ email, name, password });
    return data.user;
  }
);

export const getOrders = createAsyncThunk(
  'user/Orders',
  async () => await getOrdersApi()
);
