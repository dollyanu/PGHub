import { Navigate } from "react-router-dom";

const OwnerRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {

    const user = JSON.parse(storedUser);

    if (user.role !== "owner") {
      return <Navigate to="/" replace />;
    }

    return children;

  } catch (error) {

    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
};

export default OwnerRoute;