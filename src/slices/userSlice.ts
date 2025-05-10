import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../utils/cookie';

interface TAuthResponse {
  isAuthChecked: boolean;
  errorText: string;
  user: TUser | null;
  orders: TOrder[];
}

const initialState: TAuthResponse = {
  isAuthChecked: false,
  errorText: '',
  user: null,
  orders: []
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const fetchRegister = createAsyncThunk(
  'user/fetchRegister',
  async ({ email, name, password }: TRegisterData) => {
    const data = await registerUserApi({ email, name, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const fetchLogin = createAsyncThunk(
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

export const fetchUpdateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async ({ email, name, password }: TRegisterData) => {
    const data = await updateUserApi({ email, name, password });
    return data.user;
  }
);

export const fetchOrders = createAsyncThunk(
  'user/Orders',
  async () => await getOrdersApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.user = null;
    }
  },
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    selectUserName: (sliceState) => sliceState.user?.name,
    isAuthCheckedSelector: (sliceState) => sliceState.isAuthChecked,
    selectError: (sliceState) => sliceState.errorText,
    selectOrders: (sliceState) => sliceState.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegister.rejected, (state, action) => {
        state.errorText = action.error.message ? action.error.message : '';
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorText = '';
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.errorText = action.error.message ? action.error.message : '';
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorText = '';
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.errorText = action.error.message ? action.error.message : '';
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.errorText = '';
        state.user = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const {
  selectUser,
  isAuthCheckedSelector,
  selectError,
  selectOrders,
  selectUserName
} = userSlice.selectors;

export const { userLogout } = userSlice.actions;
export default userSlice.reducer;
