import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { getIngredientsApi, orderBurgerApi } from '@api';

interface TIngredientsList {
  ingredients: TIngredient[];
  isLoading: boolean;
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: TIngredientsList = {
  ingredients: [],
  isLoading: true,
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'burger/fetchIngredients',
  async () => await getIngredientsApi()
);

export const fetchOrderBurger = createAsyncThunk(
  'burger/fetchOrderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
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
    handleMoveDownAction(state, action: PayloadAction<string>) {
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
    handleMoveUpAction(state, action: PayloadAction<string>) {
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
    handleCloseAction(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    }
  },
  selectors: {
    selectIsLoading: (sliceState) => sliceState.isLoading,
    selectBuns: (sliceState) =>
      sliceState.ingredients.filter((i) => i.type === 'bun'),
    selectMains: (sliceState) =>
      sliceState.ingredients.filter((i) => i.type === 'main'),
    selectSauces: (sliceState) =>
      sliceState.ingredients.filter((i) => i.type === 'sauce'),
    selectConstructorItems: (sliceState) => sliceState.constructorItems,
    selectIngredients: (sliceState) => sliceState.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        console.log('error: ' + action.payload);
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const {
  selectIsLoading,
  selectBuns,
  selectMains,
  selectSauces,
  selectConstructorItems,
  selectIngredients
} = burgerSlice.selectors;

export const {
  addIngredient,
  handleCloseAction,
  handleMoveUpAction,
  handleMoveDownAction
} = burgerSlice.actions;
export default burgerSlice.reducer;
