import React, { useState } from "react";
import { Link } from "react-router-dom";

const CardProducto = ({ prod, agregarAlCarrito, lanzarAnimacion, formatearCOP }) => {
  const [imagenActual, setImagenActual] = useState(0);
  let intervalo;

  const iniciarHover = () => {
    if (prod.imagenes?.length > 1) {
      intervalo = setInterval(() => {
        setImagenActual((prev) => (prev + 1) % prod.imagenes.length);
      }, 1500);
    }
  };

  const detenerHover = () => {
    clearInterval(intervalo);
    setImagenActual(0);
  };

  return (
    <div
      className="card-producto"
      onMouseEnter={iniciarHover}
      onMouseLeave={detenerHover}
    >
      <Link to={`/producto/${prod._id}`} className="enlace-producto">
        <img
          src={
            prod.imagenes && prod.imagenes.length > 0
              ? prod.imagenes[imagenActual]
              : "/imagenes/default.jpg"
          }
          alt={prod.nombre}
          className="imagen-producto"
        />
        <h3>{prod.nombre}</h3>
        <p>{prod.descripcion}</p>
        <p>💰 {formatearCOP(prod.precio)}</p>
      </Link>

      <button
        className="boton-agregar"
        onClick={(e) => {
          agregarAlCarrito(prod);
          lanzarAnimacion(e.target, prod.imagenes?.[0]);
        }}
        disabled={prod.stock === 0}
        style={{
          backgroundColor: prod.stock === 0 ? "#ccc" : undefined,
          cursor: prod.stock === 0 ? "not-allowed" : undefined,
        }}
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default CardProducto;