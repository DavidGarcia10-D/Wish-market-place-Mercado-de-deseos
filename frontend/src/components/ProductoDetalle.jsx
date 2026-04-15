import React from "react";
import { useParams } from "react-router-dom";

const ProductoDetalle = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Detalle del producto</h2>
      <p>ID recibido: {id}</p>
      <p>Este es un componente de prueba aislada.</p>
    </div>
  );
};

export default ProductoDetalle;