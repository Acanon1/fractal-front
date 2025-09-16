import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCTS_API = "https://fractal-back.onrender.com/api/products";
const ORDERS_API = "https://fractal-back.onrender.com/api/orders";

export default function AddEditOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("Pending");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_API);
        if (!response.ok) throw new Error("Error obteniendo productos ");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError( err);
      }
    };
    fetchProducts();
  }, []);

  const addProductToOrder = () => {
    if (!selectedProductId || quantity <= 0) return;

    const product = products.find((p) => p.Id === parseInt(selectedProductId));
    if (!product) return;

    const totalPrice = product.Price * quantity;

    setOrderItems((prev) => [
      ...prev,
      {
        productId: product.Id,
        name: product.Name,
        quantity,
        totalPrice,
      },
    ]);
  };

  const finalPrice = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderNumber || orderItems.length === 0) {
      setError("ingresar un producto");
      return;
    }

    const newOrder = {
      orderNumber,
      date: new Date().toISOString(),
      status,
      finalPrice,
      products: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
    };

    try {
      const response = await fetch(ORDERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("Error creando orden");

      navigate("/my-orders");
    } catch (err) {
      setError("error al guardar la orden    " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Crear Nueva Orden</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Número de Orden:</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Estado:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <h3>Agregar Productos</h3>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            style={{ flex: 2, padding: "0.5rem" }}
          >
            <option value="">-- Selecciona un producto --</option>
            {products.map((p) => (
              <option key={p.Id} value={p.Id}>
                {p.Name} (${p.Price})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            style={{ flex: 1, padding: "0.5rem" }}
          />
          <button type="button" onClick={addProductToOrder}>
            Agregar
          </button>
        </div>

        <h4>Productos en la Orden:</h4>
        <ul>
          {orderItems.map((item, idx) => (
            <li key={idx}>
              {item.name} - {item.quantity} x ${item.totalPrice}
            </li>
          ))}
        </ul>

        <p><strong>Total: ${finalPrice}</strong></p>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Crear Orden
          </button>
          <button
            type="button"
            style={{ padding: "0.5rem 1rem" }}
            onClick={() => navigate("/my-orders")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
