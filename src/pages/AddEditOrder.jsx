import React, { useEffect, useState } from "react";

const PRODUCTS_API = "https://fractal-back.onrender.com/api/products";
const ORDERS_API = "https://fractal-back.onrender.com/api/orders";

export default function AddEditOrder() {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState("");

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
    fetchProducts();
  }, []);

  const updateQuantity = (product, qty) => {
    const quantity = parseInt(qty) || 0;
    setOrderItems((prev) => {
      const exists = prev.find((p) => p.productId === product.id);
      if (exists) {
        return prev.map((p) =>
          p.productId === product.id
            ? { ...p, quantity, totalPrice: quantity * product.price }
            : p
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            totalPrice: quantity * product.price,
          },
        ];
      }
    });
  };

  const finalPrice = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const submitOrder = async () => {
    const validItems = orderItems.filter((item) => item.quantity > 0);
    if (validItems.length === 0) {
      alert("Agrega al menos un producto.");
      return;
    }

   
    const orderTransaction = {
      date: new Date().toISOString(),
      status: "Pendiente",
      finalPrice,
      orderProducts: validItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
    };

    try {
      const res = await fetch(ORDERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderTransaction),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("Pedido creado exitosamente");
      setOrderItems([]);
    } catch (err) {
      alert("Error al crear la orden: " + err.message);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Crear orden</h1>

      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const item = orderItems.find((oit) => oit.productId === p.id);
            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={item ? item.quantity : 0}
                    onChange={(e) => updateQuantity(p, e.target.value)}
                  />
                </td>
                <td>{item ? `$${item.totalPrice}` : "$0"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Total: ${finalPrice}</h2>

      <button onClick={submitOrder}>Enviar orden</button>
    </main>
  );
}
