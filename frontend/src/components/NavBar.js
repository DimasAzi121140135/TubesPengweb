import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <div>
        <Link
          to="/products"
          className="font-semibold text-xl hover:text-gray-300"
        >
          Stock Monitoring
        </Link>
      </div>
      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
