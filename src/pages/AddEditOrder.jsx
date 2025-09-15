import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function AddEditOrder() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { Id } = useParams(); 
  const onProductAdded = location.state?.onProductAdded;


  useEffect(() => {
    if (!Id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://localhost:7212/api/Products/${Id}`);
        if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);
        const product = await response.json();
        setName(product.name);
        setPrice(product.price);
        setQuantity(product.quantity);
      } catch (err) {
        setError("Error cargando producto: " + err.message);
      }
    };

    fetchProduct();
  }, [Id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || price <= 0 || quantity < 0) {
      setError("Ingresa datos validos");
      return;
    }

    const product = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    try {
      let response;
      if (Id) {

        response = await fetch(`https://localhost:7212/api/Products/${Id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
      } else {
        // CREAR
        response = await fetch("https://localhost:7212/api/Products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
      }

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const newProduct = await response.json();

      if (!Id && onProductAdded) onProductAdded(newProduct);

      navigate("/my-orders"); 
    } catch (err) {
      setError("Error al guardar producto: " + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>{Id ? "Editar Producto" : "Crear Nuevo Producto"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Precio:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Cantidad:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            {Id ? "Guardar" : "Crear"}
          </button>
          <button type="button" style={{ padding: "0.5rem 1rem" }} onClick={() => navigate("/my-orders")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
