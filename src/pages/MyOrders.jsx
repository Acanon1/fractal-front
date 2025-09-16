import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://fractal-back.onrender.com/api/orders";

const PRODUCTS_API = "https://fractal-back.onrender.com/api/products";



export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(PRODUCTS_API);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Error al traer productos: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    
        fetchProducts();
    }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Fallo en obtener orden:", err);
      setError("No se pudieron cargar las ordenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const goToAddOrder = () => {
    navigate("/add-order");
  };

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Ordenes disponibles</h1>

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
        Crear nueva orden de compra
      </button>

      
     

      {!loading && !error && orders.length === 0 && (
        <p>No hay ordenes todavia.</p>
      )}

      {!loading && !error && orders.length > 0 && (
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
              <tr key={order.Id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {order.OrderNumber}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {new Date(order.Date).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {order.Status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  ${order.FinalPrice}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {order.Products && order.Products.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                      {order.Products.map((p, idx) => (
                        <li key={idx}>
                          {p.Name} — {p.Quantity} × ${p.TotalPrice}
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

 
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
