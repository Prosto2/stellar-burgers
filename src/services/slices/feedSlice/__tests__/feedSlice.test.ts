import feedReducer, {
  selectOrders,
  selectTotals,
  selectOrderData
} from '../feedSlice';
import { getFeeds, GetOrderByNumber } from '../actions';
import { configureStore } from '@reduxjs/toolkit';
import { mockOrders } from './fixtures/feedSliceFixture.json';

describe('Тестирование feedSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { feed: feedReducer },
      preloadedState: {
        feed: {
          orders: [],
          orderData: null,
          total: 0,
          totalToday: 0,
          errorText: ''
        }
      }
    });
  });

  it('должно быть возвращено исходное состояние', () => {
    const state = store.getState().feed;
    expect(state).toEqual({
      orders: [],
      orderData: null,
      total: 0,
      totalToday: 0,
      errorText: ''
    });
  });

  describe('Тестирование обработки редьюсером экшенов, генерируемых при выполнении асинхронного запроса', () => {
    it('тестирование getFeeds fulfilled', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrders,
          total: 10,
          totalToday: 3
        }
      };
      const state = feedReducer(undefined, action);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(10);
      expect(state.totalToday).toBe(3);
      expect(state.errorText).toBe('');
    });

    it('тестирование getFeeds rejected', () => {
      const action = {
        type: getFeeds.rejected.type,
        error: { message: 'Failed to fetch feeds' }
      };
      const state = feedReducer(undefined, action);
      expect(state.errorText).toBe('Failed to fetch feeds');
    });

    it('тестирование GetOrderByNumber fulfilled', () => {
      const action = {
        type: GetOrderByNumber.fulfilled.type,
        payload: {
          orders: [mockOrders[0]]
        }
      };
      const state = feedReducer(undefined, action);
      expect(state.orderData).toEqual(mockOrders[0]);
      expect(state.errorText).toBe('');
    });

    it('тестирование GetOrderByNumber rejected', () => {
      const action = {
        type: GetOrderByNumber.rejected.type,
        error: { message: 'Failed to fetch order by number' }
      };
      const state = feedReducer(undefined, action);
      expect(state.errorText).toBe('Failed to fetch order by number');
    });
  });

  describe('Тестирование селекторов', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: { feed: feedReducer },
        preloadedState: {
          feed: {
            orders: mockOrders,
            orderData: mockOrders[0],
            total: 15,
            totalToday: 5,
            errorText: ''
          }
        }
      });
    });

    it('тестирование selectOrders', () => {
      const orders = selectOrders(store.getState());
      expect(orders).toEqual(mockOrders);
    });

    it('тестирование selectTotals', () => {
      const totals = selectTotals(store.getState());
      expect(totals).toEqual({ total: 15, totalToday: 5 });
    });

    it('тестирование selectOrderData', () => {
      const orderData = selectOrderData(store.getState());
      expect(orderData).toEqual(mockOrders[0]);
    });
  });
});
