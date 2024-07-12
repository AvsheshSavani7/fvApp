import { Navigate } from "react-router-dom";

export const getElement = (Component, auth) => {
  return auth?.token ? <Component /> : <Navigate to="/login" />;
};
