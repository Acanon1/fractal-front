import React from "react";

import DeleteButton from "./DeleteButton";

export default function ProductsTable({ products, onProductDeleted }) {


  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#e9ecef" }}>
          <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>ID</th>
          <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Name</th>
          <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Price</th>
          <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Quantity</th>
          <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Options</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} style={{ backgroundColor: "#fff" }}>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{product.id}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{product.name}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>${product.price}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{product.quantity}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button
                style={{ padding: "0.25rem 0.5rem", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
         
              >
                Edit
              </button>
              
              <DeleteButton
                productId={product.id}
                onDeleted={(id) => onProductDeleted(id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
