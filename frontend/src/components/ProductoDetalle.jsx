import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    // Fetch directo al backend usando el id de la URL
    fetch(`${process.env.REACT_APP_API_URL}/productos/${id}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div className="detalle-producto">
      <img src={producto.imagen} alt={producto.nombre} className="detalle-imagen" />
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: ${producto.precio}</p>

      <div className="detalle-botones">
        <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
        <button onClick={() => navigate(-1)}>Regresar</button>
      </div>
    </div>
  );
};

export default ProductoDetalle;