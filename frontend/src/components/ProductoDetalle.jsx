import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./ProductoDetalle.css";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Producto no encontrado");
        return res.json();
      })
      .then((data) => {
        setProducto(data);
        setImagenActiva(data.imagenUrl || data.imagenes?.[0] || "fallback.png");
      })
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div className="detalle-producto">
      {/* Imagen principal */}
      <div className="detalle-imagen-principal">
        <img src={imagenActiva} alt={producto.nombre} />
      </div>

      {/* Miniaturas */}
      <div className="detalle-miniaturas">
        {producto.imagenUrl && (
          <img
            src={producto.imagenUrl}
            alt="principal"
            onClick={() => setImagenActiva(producto.imagenUrl)}
            className={imagenActiva === producto.imagenUrl ? "miniatura-activa" : ""}
          />
        )}
        {producto.imagenes?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`miniatura ${index}`}
            onClick={() => setImagenActiva(img)}
            className={imagenActiva === img ? "miniatura-activa" : ""}
          />
        ))}
      </div>

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