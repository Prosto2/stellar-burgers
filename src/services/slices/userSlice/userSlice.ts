import { createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import {
  getOrders,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  UpdateUser
} from './actions';

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
      .addCase(registerUser.rejected, (state, action) => {
        state.errorText = action.error.message || '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorText = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.errorText = action.error.message || '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorText = '';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.errorText = action.error.message || '';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(UpdateUser.rejected, (state, action) => {
        state.errorText = action.error.message || '';
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        state.errorText = '';
        state.user = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.errorText = action.error.message || '';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.errorText = action.error.message || '';
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
