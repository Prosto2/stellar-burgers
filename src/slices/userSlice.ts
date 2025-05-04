import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { loginUserApi, registerUserApi, TLoginData, TRegisterData } from '@api';

interface TAuthResponse {
  refreshToken: string;
  accessToken: string;
  user: TUser;
}

const initialState: TAuthResponse = {
  refreshToken: '',
  accessToken: '',
  user: {
    email: '',
    name: ''
  }
};

export const fetchRegister = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/fetchRegister',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const fetchLogin = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/fetchLogin',
  async (data: TLoginData) => await loginUserApi(data)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (sliceState) => sliceState.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegister.rejected, (state, action) => {
        console.log(action.error);
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        console.log(state.user);
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        console.log(action.error);
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        console.log(state.user);
      });
  }
});

export const { selectUser } = userSlice.selectors;

export const {} = userSlice.actions;
export default userSlice.reducer;
