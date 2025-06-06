import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { Preloader } from '@ui';
import { isAuthCheckedSelector } from '../../services/slices/userSlice/userSlice';
import { getUser } from '../../services/slices/userSlice/actions';
import { getIngredients } from '../../services/slices/burgerSlice/actions';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getIngredients());
  }, [dispatch]);

  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const isAuthChecked = useSelector(isAuthCheckedSelector);

  return (
    <div className={styles.app}>
      {!isAuthChecked ? (
        <Preloader />
      ) : (
        <>
          <AppHeader />
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/login' element={<ProtectedRoute onlyUnAuth />}>
              <Route path='/login' element={<Login />} />
            </Route>
            <Route path='/register' element={<ProtectedRoute onlyUnAuth />}>
              <Route path='/register' element={<Register />} />
            </Route>
            <Route
              path='/forgot-password'
              element={<ProtectedRoute onlyUnAuth />}
            >
              <Route path='/forgot-password' element={<ForgotPassword />} />
            </Route>
            <Route
              path='/reset-password'
              element={<ProtectedRoute onlyUnAuth />}
            >
              <Route path='/reset-password' element={<ResetPassword />} />
            </Route>
            <Route path='/profile' element={<ProtectedRoute />}>
              <Route path='/profile'>
                <Route index element={<Profile />} />
                <Route path='orders' element={<ProfileOrders />} />
                <Route path='/profile/orders/:number' element={<OrderInfo />} />
              </Route>
            </Route>
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={'Информация о заказе'}
                    onClose={() => navigate(-1)}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal
                    title={'Детали ингредиента'}
                    onClose={() => navigate(-1)}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={<ProtectedRoute />}
              >
                <Route
                  path='/profile/orders/:number'
                  element={
                    <Modal
                      title={'Информация о заказе'}
                      onClose={() => navigate(-1)}
                    >
                      <OrderInfo />
                    </Modal>
                  }
                />
              </Route>
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
