import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/Usecontext.jsx';
import GroceryLoader from '../components/Loading.jsx';

export default function Logout() {
  const { handleUserLogout } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const performLogout = async () => {
      try {
        if (handleUserLogout) {
          await handleUserLogout();
        }
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        if (isMounted) {
          navigate('/login', { replace: true });
        }
      }
    };

    performLogout();

    return () => {
      isMounted = false;
    };
  }, [handleUserLogout, navigate]);

  return <GroceryLoader />;
}
