import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// API endpoints
const PRODUCTS_API = "https://fractal-back.onrender.com/api/products";
const ORDERS_API = "https://fractal-back.onrender.com/api/orders";

export default function AddEditOrder() {
  const { id } = useParams(); // edit if exists
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState("Pendiente");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [modalProductId, setModalProductId] = useState("");
  const [modalQuantity, setModalQuantity] = useState(1);

  //
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(PRODUCTS_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Error cargando productos: " + err.message);
      }
    };

    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${ORDERS_API}/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStatus(data.status);
        setDate(new Date(data.date));
        setOrderItems(
          data.orderProducts.map((op) => ({
            productId: op.product.id,
            name: op.product.name,
            price: op.product.price,
            quantity: op.quantity,
            totalPrice: op.quantity * op.product.price,
          }))
        );
      } catch (err) {
        setError("Error cargando orden: " + err.message);
      }
    };

    Promise.all([fetchProducts(), fetchOrder()]).finally(() => setLoading(false));
  }, [id]);

  const finalPrice = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalProducts = orderItems.length;

  //
  const confirmAddProduct = () => {
    if (!modalProductId || modalQuantity < 1) return;

    const prod = products.find((p) => p.id === parseInt(modalProductId));
    if (!prod) return;

    const exists = orderItems.find((item) => item.productId === prod.id);
    if (exists) {
      setOrderItems(orderItems.map((item) =>
        item.productId === prod.id
          ? { ...item, quantity: modalQuantity, totalPrice: modalQuantity * item.price }
          : item
      ));
    } else {
      setOrderItems([
        ...orderItems,
        { productId: prod.id, name: prod.name, price: prod.price, quantity: modalQuantity, totalPrice: modalQuantity * prod.price }
      ]);
    }

    setModalProductId("");
    setModalQuantity(1);
    setShowModal(false);
  };

  const editOrderItem = (item) => {
    setModalProductId(item.productId.toString());
    setModalQuantity(item.quantity);
    setShowModal(true);
  };

  const removeOrderItem = (item) => {
    if (window.confirm("Deseas eliminar este producto")) {
      setOrderItems(orderItems.filter((i) => i.productId !== item.productId));
    }
  };

  const submitOrder = async () => {
    if (totalProducts === 0) {
      alert("Agrega al menos un producto.");
      return;
    }

    const payload = {
      status,
      orderProducts: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${ORDERS_API}/${id}` : ORDERS_API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al guardar la orden");
      }

      alert(`Orden ${id ? "actualizada" : "creada"} exitosamente`);
      navigate("/orders");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: "1rem" }}>
      <h1>{id ? "Edit Order" : "Add Order"}</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Date: </label>
        <input type="text" disabled value={date.toLocaleDateString()} />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label># Products: </label>
        <input type="text" disabled value={totalProducts} />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Final Price: </label>
        <input type="text" disabled value={`$${finalPrice.toFixed(2)}`} />
      </div>

      <button onClick={() => setShowModal(true)}>Agregar producto</button>

 
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#00000080", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "white", padding: "1rem" }}>
            <h2>Select Product</h2>
            <select value={modalProductId} onChange={(e) => setModalProductId(e.target.value)}>
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
              ))}
            </select>
            <input type="number" min="1" value={modalQuantity} onChange={(e) => setModalQuantity(parseInt(e.target.value))} />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={confirmAddProduct}>Confirm</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

   
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", marginTop: "1rem", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Total Price</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item) => (
            <tr key={item.productId}>
              <td>{item.productId}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${item.totalPrice.toFixed(2)}</td>
              <td>
                <button onClick={() => editOrderItem(item)}>editar</button>{" "}
                <button onClick={() => removeOrderItem(item)}>eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: ${finalPrice.toFixed(2)}</h2>
      <button onClick={submitOrder}>{id ? "Actualizar orden" : "crear orden"}</button>
    </main>
  );
}
