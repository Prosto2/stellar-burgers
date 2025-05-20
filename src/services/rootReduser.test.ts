import { reducers } from './store';

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
  });
});
