import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CarritoContext);

  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Producto recibido en detalle:", data);
        setProducto(data);
      })
      .catch((error) => console.error("❌ Error al obtener producto:", error));
  }, [id]);

  const formatearCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="detalle-producto">
      <button onClick={() => navigate(-1)}>← Volver</button>

      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: {formatearCOP(producto.precio)}</p>

      {/* Imagen principal con fallback */}
      {producto.imagenes && producto.imagenes.length > 0 ? (
        <img src={producto.imagenes[0]} alt={producto.nombre} />
      ) : producto.imagenUrl ? (
        <img src={producto.imagenUrl} alt={producto.nombre} />
      ) : (
        <p>Sin imagen disponible</p>
      )}

      {/* Botón agregar al carrito */}
      <button onClick={() => agregarAlCarrito(producto)}>
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductoDetalle;