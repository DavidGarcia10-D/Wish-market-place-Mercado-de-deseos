import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Producto no encontrado");
        return res.json();
      })
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div className="detalle-producto">
      <img
        src={producto.imagenUrl || (producto.imagenes?.[0] ?? "fallback.png")}
        alt={producto.nombre}
        className="detalle-imagen"
      />
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: ${producto.precio}</p>
      <p>Categoría: {producto.categoria}</p>
      <p>Stock: {producto.stock}</p>

      <div className="detalle-botones">
        <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
        <button onClick={() => navigate(-1)}>Regresar</button>
      </div>
    </div>
  );
};

export default ProductoDetalle;