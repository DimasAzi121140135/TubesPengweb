import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import { Navigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (auth.token) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {auth.error && (
          <div className="mb-4 text-red-600 text-center">{auth.error}</div>
        )}
        <label className="block mb-2">
          Username
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          Password
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          disabled={auth.status === "loading"}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {auth.status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
