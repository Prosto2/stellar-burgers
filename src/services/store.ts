import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import burgerSliceReducer from './slices/burgerSlice/burgerSlice';
import feedSliceReducer from './slices/feedSlice/feedSlice';
import userSliceReducer from './slices/userSlice/userSlice';

const reducers = combineReducers({
  burger: burgerSliceReducer,
  feed: feedSliceReducer,
  user: userSliceReducer
});

const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof reducers>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
