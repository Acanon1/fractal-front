import React from "react";

export default function DeleteButton({ productId, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm("deseas borrar este producto")) return;

    try {
      const response = await fetch(
        `https://fractal-back.onrender.com/api/products/${productId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Fallo al eliminar producto. Status: ${response.status}`);
      }


      if (onDeleted) {
        onDeleted(productId);
      }
    } catch (err) {
      alert("Error al eliminar producto: " + err.message);
      console.error("error:", err);
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        padding: "0.25rem 0.5rem",
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "3px",
        cursor: "pointer",
      }}
    >
      Eliminar
    </button>
  );
}
