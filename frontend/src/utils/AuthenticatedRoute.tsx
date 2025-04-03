import { JSX } from "react";
import { useAuth } from "../context/authContext";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const AuthenticatedRoute = ({ children }: PrivateRouteProps) => {
  const { token } = useAuth();
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};
