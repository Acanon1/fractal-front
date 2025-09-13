import React from "react";

export default function DeleteButton({ productId, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm("deseas borrar este producto")) return;

    try {
      const response = await fetch(`https://localhost:7212/api/Products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Fallo en creacion de producto. Status: ${response.status}`);
      }

  
      onDeleted(productId);
    } catch (err) {
      alert("Error tratando de eliminar producto: " + err.message);
      console.error(err);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}