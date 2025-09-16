import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://fractal-back.onrender.com/api/orders";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error Status: ${res.status}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fallo en obtener orden:", err);
      setError("No se pueden cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const goToAddOrder = () => navigate("/add-order");

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Órdenes disponibles</h1>

      <button
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={goToAddOrder}
      >
        Crear nueva orden
      </button>

      {orders.length === 0 ? (
        <p>No hay órdenes todavía.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}># Orden</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Fecha</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Estado</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Total</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Productos</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {order.orderNumber || order.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {new Date(order.date).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {order.status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  ${order.finalPrice}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {order.orderProducts && order.orderProducts.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                      {order.orderProducts.map((op) => (
                        <li key={op.id}>
                          {op.product?.name || "Producto"} — {op.quantity} × ${op.totalPrice}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-----"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
