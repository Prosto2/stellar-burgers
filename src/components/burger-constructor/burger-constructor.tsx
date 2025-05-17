import { FC, useMemo } from 'react';
import {
  TConstructorIngredient,
  TConstructorItems,
  TOrder
} from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

import { useNavigate } from 'react-router-dom';
import {
  OrderBurger,
  removeOrderModalDataAction,
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/burgerSlice/burgerSlice';
import { selectUser } from '../../services/slices/userSlice/userSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector<TConstructorItems>(
    selectConstructorItems
  );
  const orderRequest = useSelector<boolean>(selectOrderRequest);
  const orderModalData = useSelector<TOrder | null>(selectOrderModalData);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const allIngredientIds = [
      ...(constructorItems.bun ? [constructorItems.bun._id] : []),
      ...constructorItems.ingredients.map((i) => i._id),
      ...(constructorItems.bun ? [constructorItems.bun._id] : [])
    ];
    dispatch(OrderBurger(allIngredientIds));
  };
  const closeOrderModal = () => {
    dispatch(removeOrderModalDataAction());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
