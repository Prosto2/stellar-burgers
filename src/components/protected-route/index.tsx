import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from '../../services/store';
// import { Role } from '../../types';

export const ProtectedRoute = () => {
  // const isAuthenticated = false;
  //
  // if (!isAuthenticated) {
  //   return <Navigate to='/register' />;
  // }

  return <Outlet />;
};
