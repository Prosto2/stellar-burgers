import {
  orderModalData,
  ingredients
} from './fixtures/burgerSliceFixture.json';
import burgerReducer, {
  ingredientID,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearOrderModalData,
  selectIsLoading,
  selectBuns,
  selectMains,
  selectSauces,
  selectConstructorItems,
  selectAllIngredients,
  selectOrderRequest,
  selectOrderModalData,
  selectIngredientByID
} from '../burgerSlice';
import { TConstructorIngredient } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { getIngredients, OrderBurger } from '../actions';
describe('Тестирование burgerSlice', () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: { burger: burgerReducer },
      preloadedState: {
        burger: {
          ingredients: ingredients,
          ingredientID: ingredients[1]._id,
          isLoading: true,
          orderRequest: false,
          orderModalData: orderModalData,
          constructorItems: {
            bun: null,
            ingredients: []
          },
          errorText: ''
        }
      }
    });
  });

  it('должно быть возвращено исходное состояние', () => {
    const state = store.getState().burger;
    expect(state).toEqual({
      ingredients: ingredients,
      ingredientID: ingredients[1]._id,
      isLoading: true,
      orderRequest: false,
      orderModalData: orderModalData,
      constructorItems: {
        bun: null,
        ingredients: []
      },
      errorText: ''
    });
  });

  describe('Тестирование редьюсеров', () => {
    it('тестирование ingredientID', () => {
      store.dispatch(ingredientID('123'));
      const state = store.getState().burger;
      expect(state.ingredientID).toBe('123');
    });

    it('тестирование addIngredient', () => {
      store.dispatch(addIngredient(ingredients[0]));
      const state = store.getState().burger;
      expect(state.constructorItems.bun).toEqual(ingredients[0]);
    });

    it('тестирование removeIngredient', () => {
      const ingredient: TConstructorIngredient = { ...ingredients[1], id: '0' };
      store.dispatch(addIngredient(ingredient));
      store.dispatch(removeIngredient('0'));
      const state = store.getState().burger;
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });

    it('тестирование moveIngredientUp', () => {
      const firstIngredient: TConstructorIngredient = {
        ...ingredients[1],
        id: '0'
      };
      const secondIngredient: TConstructorIngredient = {
        ...ingredients[2],
        id: '1'
      };
      store.dispatch(addIngredient(firstIngredient));
      store.dispatch(addIngredient(secondIngredient));
      store.dispatch(moveIngredientUp('1'));
      const state = store.getState().burger;
      expect(state.constructorItems.ingredients[0]).toEqual(secondIngredient);
    });

    it('тестирование moveIngredientDown', () => {
      const firstIngredient: TConstructorIngredient = {
        ...ingredients[1],
        id: '0'
      };
      const secondIngredient: TConstructorIngredient = {
        ...ingredients[2],
        id: '1'
      };
      store.dispatch(addIngredient(firstIngredient));
      store.dispatch(addIngredient(secondIngredient));
      store.dispatch(moveIngredientDown('0'));
      const state = store.getState().burger;
      expect(state.constructorItems.ingredients[1]).toEqual(firstIngredient);
    });

    it('тестирование clearOrderModalData', () => {
      store.dispatch(clearOrderModalData());
      const state = store.getState().burger;
      expect(state.orderModalData).toBeNull();
      expect(state.orderRequest).toBe(false);
    });
  });

  describe('Тестирование обработки редьюсером экшенов, генерируемых при выполнении асинхронного запроса', () => {
    it('тестирование getIngredients pending', () => {
      const action = { type: getIngredients.pending.type };
      const state = burgerReducer(undefined, action);
      expect(state.isLoading).toBe(true);
    });

    it('тестирование getIngredients rejected', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: { message: 'Failed to fetch ingredients' }
      };
      const state = burgerReducer(undefined, action);
      expect(state.isLoading).toBe(false);
      expect(state.errorText).toBe('Failed to fetch ingredients');
    });

    it('тестирование getIngredients fulfilled', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: [ingredients[1]]
      };
      const state = burgerReducer(undefined, action);
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(action.payload);
    });

    it('тестирование OrderBurger pending', () => {
      const action = { type: OrderBurger.pending.type };
      const state = burgerReducer(undefined, action);
      expect(state.orderRequest).toBe(true);
    });

    it('тестирование OrderBurger rejected', () => {
      const action = {
        type: OrderBurger.rejected.type,
        error: { message: 'Failed to order burger' }
      };
      const state = burgerReducer(undefined, action);
      expect(state.orderRequest).toBe(false);
      expect(state.errorText).toBe('Failed to order burger');
    });

    it('тестирование OrderBurger fulfilled', () => {
      const action = {
        type: OrderBurger.fulfilled.type,
        payload: {
          order: {
            _id: '123123',
            status: 'pending',
            name: 'Super order',
            createdAt: '123123',
            updatedAt: '321321',
            number: 1,
            ingredients: ['7', '5']
          }
        }
      };
      const state = burgerReducer(undefined, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(action.payload.order);
      expect(state.constructorItems).toEqual({ bun: null, ingredients: [] });
    });
  });

  describe('Тестирование селекторов', () => {
    it('тестирование селектора isLoading', () => {
      const isLoading = selectIsLoading(store.getState());
      expect(isLoading).toBe(true);
    });

    it('тестирование селектора selectBuns', () => {
      const buns = selectBuns(store.getState());
      expect(buns).toEqual([ingredients[0]]);
    });

    it('тестирование селектора selectMains', () => {
      const mains = selectMains(store.getState());
      expect(mains).toEqual([ingredients[1]]);
    });

    it('тестирование селектора selectSauces', () => {
      const sauces = selectSauces(store.getState());
      expect(sauces).toEqual([ingredients[2]]);
    });

    it('тестирование селектора selectConstructorItems', () => {
      const constructorItems = selectConstructorItems(store.getState());
      expect(constructorItems).toEqual({
        bun: null,
        ingredients: []
      });
    });

    it('тестирование селектора selectIngredients', () => {
      const ingredients = selectAllIngredients(store.getState());
      expect(ingredients).toEqual(ingredients);
    });

    it('тестирование селектора selectOrderRequest', () => {
      const orderRequest = selectOrderRequest(store.getState());
      expect(orderRequest).toBe(false);
    });

    it('тестирование селектора selectOrderModalData', () => {
      const orderModalData = selectOrderModalData(store.getState());
      expect(orderModalData).toEqual(orderModalData);
    });

    it('тестирование селектора selectIngredientByID', () => {
      const selectedIngredient = selectIngredientByID(store.getState());
      expect(selectedIngredient).toEqual(ingredients[1]);
    });
  });
});
