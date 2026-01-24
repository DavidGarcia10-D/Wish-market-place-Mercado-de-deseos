import React, { useState, useEffect, useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import "./Productos.css";

const Productos = ({ apiUrl, categoria }) => {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const endpoint = categoria
          ? `${apiUrl}/api/productos/categoria/${categoria}`
          : `${apiUrl}/productos`;

        const res = await fetch(endpoint);
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      }
    };

    obtenerProductos();
  }, [categoria, apiUrl]);

  const formatearCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  return (
    <div className="contenedor-productos">
      <h2 className="titulo-productos">
        {categoria ? `🛍️ Productos de ${categoria}` : "🛍️ Todos los productos"}
      </h2>

      <div className="grid-productos">
        {productos.length === 0 ? (
          <p>No hay productos disponibles en esta categoría.</p>
        ) : (
          productos.map((prod) => (
            <div key={prod._id} className="card-producto">
              <img
                src={prod.imagenUrl}
                alt={prod.nombre}
                onError={(e) => (e.target.src = "/imagenes/default.jpg")}
              />
              <h3>{prod.nombre}</h3>
              <p>{prod.descripcion}</p>
              <p>💰 {formatearCOP(prod.precio)}</p>
              <button
                className="boton-agregar"
                onClick={() => agregarAlCarrito(prod)}
                disabled={prod.stock === 0}
                style={{
                  backgroundColor: prod.stock === 0 ? "#ccc" : undefined,
                  cursor: prod.stock === 0 ? "not-allowed" : undefined,
                }}
              >
                Agregar al carrito
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Productos;