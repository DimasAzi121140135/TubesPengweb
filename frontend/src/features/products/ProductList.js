import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "./productSlice";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <button
        onClick={() => navigate("/products/new")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Product
      </button>
      {status === "loading" && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-100">
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.description}</td>
              <td className="border p-2">{p.quantity}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">
                <button
                  onClick={() => navigate(`/products/edit/${p.id}`)}
                  className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
