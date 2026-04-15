import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

const ProductoDetalle = ({ productos }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  // Buscar producto por id
  const producto = productos?.find((p) => p.id === parseInt(id));

  if (!producto) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <div className="detalle-producto">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="detalle-imagen"
      />
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: ${producto.precio}</p>

      <div className="detalle-botones">
        <button onClick={() => agregarAlCarrito(producto)}>
          Agregar al carrito
        </button>
        <button onClick={() => navigate(-1)}>Regresar</button>
      </div>
    </div>
  );
};

export default ProductoDetalle;