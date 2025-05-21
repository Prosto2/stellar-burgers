import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorItems, TIngredient, TOrder } from '@utils-types';
import { getIngredients, OrderBurger } from './actions';
import { RootState } from '../../store';

interface TIngredientsList {
  ingredients: TIngredient[];
  ingredientID: string;
  isLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  constructorItems: TConstructorItems;
  errorText: string;
}

export const initialState: TIngredientsList = {
  ingredients: [],
  ingredientID: '',
  isLoading: true,
  orderRequest: false,
  orderModalData: null,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  errorText: ''
};

const selectBurgerSlice = (state: RootState) => state.burger;

const selectIngredients = createSelector(
  selectBurgerSlice,
  (burger) => burger.ingredients
);

export const selectBuns = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((i) => i.type === 'bun')
);

export const selectMains = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((i) => i.type === 'main')
);

export const selectSauces = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((i) => i.type === 'sauce')
);

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    ingredientID(state, action: PayloadAction<string>) {
      state.ingredientID = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: '' + state.constructorItems.ingredients.length
        });
      }
    },
    moveIngredientDown(state, action: PayloadAction<string>) {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === action.payload
      );

      if (index >= 0 && index < state.constructorItems.ingredients.length - 1) {
        const ingredientToMove = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients.splice(index, 1);
        state.constructorItems.ingredients.splice(
          index + 1,
          0,
          ingredientToMove
        );
      }
    },
    moveIngredientUp(state, action: PayloadAction<string>) {
      const index = state.constructorItems.ingredients.findIndex(
        (i) => i.id === action.payload
      );

      if (index > 0) {
        const ingredientToMove = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients.splice(index, 1);
        state.constructorItems.ingredients.splice(
          index - 1,
          0,
          ingredientToMove
        );
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    },
    clearOrderModalData(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  selectors: {
    selectIsLoading: (sliceState) => sliceState.isLoading,
    selectConstructorItems: (sliceState) => sliceState.constructorItems,
    selectAllIngredients: (sliceState) => sliceState.ingredients,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderModalData: (sliceState) => sliceState.orderModalData,
    selectIngredientByID: (sliceState) =>
      sliceState.ingredients.find(
        (ingredient) => ingredient._id === sliceState.ingredientID
      )
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || '';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(OrderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(OrderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.errorText = action.error.message || '';
      })
      .addCase(OrderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  selectIsLoading,
  selectConstructorItems,
  selectAllIngredients,
  selectOrderRequest,
  selectOrderModalData,
  selectIngredientByID
} = burgerSlice.selectors;

export const {
  ingredientID,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearOrderModalData
} = burgerSlice.actions;
export default burgerSlice.reducer;
