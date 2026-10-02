import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/Usecontext';
import GroceryLoader from '../components/Loading';

const AdminProtection = ({ children }) => {
  const { adminRefresh, adminData } = useContext(GlobalContext);
  const location = useLocation();
// console.log(adminData);

  if (adminRefresh) {
    return <GroceryLoader />;
  }

  if (!adminData) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtection;