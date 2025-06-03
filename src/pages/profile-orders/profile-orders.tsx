import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectOrders } from '../../services/slices/userSlice/userSlice';
import { getOrders } from '../../services/slices/userSlice/actions';

export const ProfileOrders: FC = () => {
  const orders = useSelector<TOrder[]>(selectOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
