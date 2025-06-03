import userReducer, {
  userLogout,
  selectUser,
  selectUserName,
  isAuthCheckedSelector,
  selectError,
  selectOrders
} from '../userSlice';
import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  UpdateUser,
  getOrders
} from '../actions';
import { configureStore } from '@reduxjs/toolkit';
import { mockUser, mockOrders } from './fixtures/userSliceFixture.json';

describe('Тестирование userSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: {
          isAuthChecked: false,
          errorText: '',
          user: null,
          orders: []
        }
      }
    });
  });

  it('должно быть возвращено исходное состояние', () => {
    expect(store.getState().user).toEqual({
      isAuthChecked: false,
      errorText: '',
      user: null,
      orders: []
    });
  });

  describe('Тестирование редьюсеров', () => {
    it('тестирование userLogout', () => {
      store.dispatch(userLogout());
      expect(store.getState().user.user).toBeNull();
    });
  });

  describe('Тестирование обработки редьюсером экшенов, генерируемых при выполнении асинхронного запроса', () => {
    it('тестирование registerUser fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(undefined, action);
      expect(state.user).toEqual(mockUser);
      expect(state.errorText).toBe('');
    });

    it('тестирование registerUser rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Registration failed' }
      };
      const state = userReducer(undefined, action);
      expect(state.errorText).toBe('Registration failed');
    });

    it('тестирование loginUser fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(undefined, action);
      expect(state.user).toEqual(mockUser);
      expect(state.errorText).toBe('');
    });

    it('тестирование loginUser rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Login failed' }
      };
      const state = userReducer(undefined, action);
      expect(state.errorText).toBe('Login failed');
    });

    it('тестирование getUser fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(undefined, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('тестирование getUser rejected', () => {
      const action = {
        type: getUser.rejected.type,
        error: { message: 'Failed to fetch user' }
      };
      const state = userReducer(undefined, action);
      expect(state.errorText).toBe('Failed to fetch user');
      expect(state.isAuthChecked).toBe(true);
    });

    it('тестирование UpdateUser fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: UpdateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(undefined, action);
      expect(state.user).toEqual(updatedUser);
      expect(state.errorText).toBe('');
    });

    it('тестирование UpdateUser rejected', () => {
      const action = {
        type: UpdateUser.rejected.type,
        error: { message: 'Update failed' }
      };
      const state = userReducer(undefined, action);
      expect(state.errorText).toBe('Update failed');
    });

    it('тестирование getOrders fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = userReducer(undefined, action);
      expect(state.orders).toEqual(mockOrders);
    });

    it('тестирование getOrders rejected', () => {
      const action = {
        type: getOrders.rejected.type,
        error: { message: 'Failed to fetch orders' }
      };
      const state = userReducer(undefined, action);
      expect(state.errorText).toBe('Failed to fetch orders');
    });

    it('тестирование logoutUser rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: 'Logout failed' }
      };
      const state = userReducer(undefined, action);
      expect(state.errorText).toBe('Logout failed');
    });
  });

  describe('Тестирование селекторов', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: { user: userReducer },
        preloadedState: {
          user: {
            isAuthChecked: true,
            errorText: '',
            user: mockUser,
            orders: mockOrders
          }
        }
      });
    });

    it('тестирование selectUser', () => {
      expect(selectUser(store.getState())).toEqual(mockUser);
    });

    it('тестирование selectUserName', () => {
      expect(selectUserName(store.getState())).toBe(mockUser.name);
    });

    it('тестирование isAuthCheckedSelector', () => {
      expect(isAuthCheckedSelector(store.getState())).toBe(true);
    });

    it('тестирование selectError', () => {
      expect(selectError(store.getState())).toBe('');
    });

    it('тестирование selectOrders', () => {
      expect(selectOrders(store.getState())).toEqual(mockOrders);
    });
  });
});
