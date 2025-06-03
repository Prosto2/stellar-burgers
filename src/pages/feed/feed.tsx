import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectOrders } from '../../services/slices/feedSlice/feedSlice';
import { getFeeds } from '../../services/slices/feedSlice/actions';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector<TOrder[]>(selectOrders);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  console.log(orders);
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
