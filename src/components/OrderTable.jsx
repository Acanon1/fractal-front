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
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{product.Id}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{product.Name}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>${product.Price}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{product.Quantity}</td>
            <td style={{ border: "1px solid #ddd", padding: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <button
                style={{ padding: "0.25rem 0.5rem", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
         
              >
                Edit
              </button>
              
              <DeleteButton
                productId={product.Id}
                onDeleted={onProductDeleted}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
