import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "https://fractal-back.onrender.com/api/orders";
const PRODUCTS_URL = "https://fractal-back.onrender.com/api/products";

export default function AddEditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [loading, setLoading] = useState(true);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // fetch products
    const fetchProducts = async () => {
      const res = await fetch(PRODUCTS_URL);
      const data = await res.json();
      setProducts(data);
    };

    const fetchOrder = async () => {
      if (!id) return;
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      setOrderNumber(data.orderNumber);
      setStatus(data.status);
      setOrderProducts(
        data.orderProducts.map((op) => ({
          productId: op.product.id,
          name: op.product.name,
          price: op.product.price,
          quantity: op.quantity,
          totalPrice: op.quantity * op.product.price,
        }))
      );
    };

    Promise.all([fetchProducts(), fetchOrder()]).finally(() => setLoading(false));
  }, [id]);

  const addProduct = () => {
    if (!selectedProductId) return;
    const prod = products.find((p) => p.id === parseInt(selectedProductId));
    if (!prod) return;

    const existing = orderProducts.find((op) => op.productId === prod.id);
    if (existing) {
      // update quantity if already exists
      setOrderProducts(orderProducts.map((op) =>
        op.productId === prod.id
          ? { ...op, quantity: op.quantity + quantity, totalPrice: (op.quantity + quantity) * op.price }
          : op
      ));
    } else {
      setOrderProducts([
        ...orderProducts,
        {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity,
          totalPrice: prod.price * quantity,
        },
      ]);
    }

    setQuantity(1);
    setSelectedProductId("");
  };

  const removeProduct = (productId) => {
    setOrderProducts(orderProducts.filter((op) => op.productId !== productId));
  };

  const finalPrice = orderProducts.reduce((sum, op) => sum + op.totalPrice, 0);

  const handleSubmit = async () => {
    if (!orderNumber || orderProducts.length === 0) {
      alert("Order number and at least one product are required.");
      return;
    }

    const payload = {
      id: id ? parseInt(id) : 0,
      orderNumber,
      status,
      orderProducts: orderProducts.map((op) => ({
        productId: op.productId,
        quantity: op.quantity,
      })),
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Error saving order");
      return;
    }

    navigate("/orders");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{id ? "Edit Order" : "Add Order"}</h1>
      <div>
        <label>Order Number: </label>
        <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
      </div>
      <div>
        <label>Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pendiente">Pendiente</option>
          <option value="Complelado">Complelado</option>
        </select>
      </div>

      <h2>Add Products</h2>
      <div>
        <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - ${p.price.toFixed(2)}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>

      <h2>Order Products</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {orderProducts.map((op) => (
            <tr key={op.productId}>
              <td>{op.name}</td>
              <td>${op.price.toFixed(2)}</td>
              <td>{op.quantity}</td>
              <td>${op.totalPrice.toFixed(2)}</td>
              <td>
                <button onClick={() => removeProduct(op.productId)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Final Price: ${finalPrice.toFixed(2)}</h3>
      <button onClick={handleSubmit}>{id ? "Update Order" : "Create Order"}</button>
    </div>
  );
}
