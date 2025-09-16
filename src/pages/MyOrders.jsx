import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ORDERS_API = "https://fractal-back.onrender.com/api/orders";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(ORDERS_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError("Error cargando órdenes: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta orden?")) return;

    try {
      const res = await fetch(`${ORDERS_API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      alert("Error eliminando orden: " + err.message);
    }
  };

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: "1rem" }}>
      <h1>My Orders</h1>

      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order #</th>
            <th>Date</th>
            <th># Products</th>
            <th>Final Price</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No orders found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderNumber}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.orderProducts.length}</td>
                <td>${order.finalPrice.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => navigate(`/orders/edit/${order.id}`)} disabled={order.status === "Complelado"}>
                    Edit
                  </button>{" "}
                  <button onClick={() => handleDelete(order.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
