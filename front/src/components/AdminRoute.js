import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);

  return user && user.role === "Admin" ? element : <Navigate to="/login" />; //protected admmin route
};

export default AdminRoute;
