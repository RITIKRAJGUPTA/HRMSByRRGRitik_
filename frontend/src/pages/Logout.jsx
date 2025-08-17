import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <Navigate to="/login" replace />;
}
