import { reducers } from './store';
import { initialState as burgerInitialState } from './slices/burgerSlice/burgerSlice';
import { initialState as feedInitialState } from './slices/feedSlice/feedSlice';
import { initialState as userInitialState } from './slices/userSlice/userSlice';

describe('Тестирование rootReducer', () => {
  it('должен возвращать исходное состояние при вызове с неопределенным состоянием и неизвестным действием', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const initialState = reducers(undefined, unknownAction);

    expect(initialState).toHaveProperty('burger');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('user');

    expect(initialState.burger).toBeDefined();
    expect(initialState.feed).toBeDefined();
    expect(initialState.user).toBeDefined();

    expect(initialState.burger).toEqual(burgerInitialState);
    expect(initialState.feed).toEqual(feedInitialState);
    expect(initialState.user).toEqual(userInitialState);
  });
});
