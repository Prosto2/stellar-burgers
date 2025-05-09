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
        localStorage.clear(); // очищаем refreshToken
        deleteCookie('accessToken'); // очищаем accessToken
        dispatch(userLogout()); // удаляем пользователя из хранилища
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
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = null;
    }
  },
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    isAuthCheckedSelector: (sliceState) => sliceState.isAuthChecked,
    selectError: (sliceState) => sliceState.errorText,
    selectOrders: (sliceState) => sliceState.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegister.rejected, (state, action) => {
        state.errorText = action.error.message ? action.error.message : '';
        console.log(action.error.message);
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorText = '';
        console.log(state.user);
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.errorText = action.error.message ? action.error.message : '';
        console.log(action.error);
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorText = '';
        console.log(state.user);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.log(action.error);
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        console.log(state.user);
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.errorText = action.error.message ? action.error.message : '';
        console.log(action.error);
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.errorText = '';
        state.user = action.payload;
        console.log(state.user);
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (0) {
      dispatch(fetchUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const { selectUser, isAuthCheckedSelector, selectError, selectOrders } =
  userSlice.selectors;

export const { authChecked, userLogout } = userSlice.actions;
export default userSlice.reducer;
