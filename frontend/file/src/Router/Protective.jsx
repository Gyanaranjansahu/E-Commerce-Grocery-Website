import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/Usecontext.jsx";
import GroceryLoader from "../components/Loading.jsx";

export default function Protection({ children }) {
  const { refresh, user } = useContext(GlobalContext);
  const location = useLocation();
//   console.log(user);
  

  if (refresh) {
    return <GroceryLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}