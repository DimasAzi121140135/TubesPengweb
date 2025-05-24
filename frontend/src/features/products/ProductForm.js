import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, fetchProducts } from "./productSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const products = useSelector((state) => state.products.products);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (id) {
      if (products.length === 0) {
        dispatch(fetchProducts());
      } else {
        const product = products.find((p) => p.id === parseInt(id));
        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            price: product.price,
          });
        }
      }
    }
  }, [id, products, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateProduct({ id: parseInt(id), product: formData }));
    } else {
      dispatch(addProduct(formData));
    }
    navigate("/products");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Quantity
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 p-2 rounded mt-1"
          />
        </label>
        <label className="block mb-4">
          Price
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 p-2 rounded mt-1"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {id ? "Update" : "Add"} Product
        </button>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="ml-2 px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
