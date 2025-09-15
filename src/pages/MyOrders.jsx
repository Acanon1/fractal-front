import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderTable from "../components/OrderTable";

const API_URL = "https://fractal-back.onrender.com/api/products";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Fallo en obtener productos:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };


  const handleProductDeleted = (deletedId) => {
    setProducts((prev) => prev.filter((p) => p.Id !== deletedId));
  };


  const goToAddProduct = () => {
    navigate("/add-order", { state: { onProductAdded: handleProductAdded } });
  };

  return (
    <main>
      <h1>My Products</h1>
      <button
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
        onClick={goToAddProduct}
      >
        Add New Product
      </button>

      <OrderTable products={products} onProductDeleted={handleProductDeleted} />
    </main>
  );
}
