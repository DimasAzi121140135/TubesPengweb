import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProductList from "./features/products/ProductList";
import ProductForm from "./features/products/ProductForm";
import UserList from "./features/users/UserList";
import Login from "./features/auth/Login";
import { useSelector } from "react-redux";

function RequireAuth({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <ProductList />
              </RequireAuth>
            }
          />
          <Route
            path="/products/new"
            element={
              <RequireAuth>
                <ProductForm />
              </RequireAuth>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <RequireAuth>
                <ProductForm />
              </RequireAuth>
            }
          />
          <Route
            path="/users"
            element={
              <RequireAuth>
                <UserList />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </div>
  );
}
