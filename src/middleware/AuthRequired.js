import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { getAuth } from "../services/identity.service";
import { useEffect } from "react";

export const AuthRequired = ({ children }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [searchParams] = useSearchParams();
  const origin = searchParams.get("origin");
  const redirectUri = searchParams.get("redirectUri");

  useEffect(() => {
    if (!!!auth?.token || !!origin || !!redirectUri) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return auth?.token ? children : <Navigate to="/login" />;
};
