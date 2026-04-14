import React, { useState, useEffect, useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { Link } from "react-router-dom"; // 👈 Importamos Link para la navegación
import "./Productos.css";

const Productos = ({ apiUrl, categoria }) => {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const endpoint = categoria
          ? `${apiUrl}/api/productos/categoria/${categoria}`
          : `${apiUrl}/api/productos`; // 👈 siempre usamos /api/productos

        const res = await fetch(endpoint);
        const data = await res.json();
        console.log("📦 Productos recibidos desde backend:", data); // 👈 Log para ver qué trae
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
          productos.map((prod) => {
            console.log("🔎 Producto individual:", prod); // 👈 Log para ver cada objeto
            return (
              <div key={prod._id || prod.id} className="card-producto">
                {/* 👇 Enlace hacia la pantalla de detalle */}
                <Link
                  to={`/producto/${prod._id || prod.id}`} // 👈 Usa _id o id según lo que venga
                  className="enlace-producto"
                >
                  <img src={prod.imagenUrl} alt={prod.nombre} />
                  <h3>{prod.nombre}</h3>
                  <p>{prod.descripcion}</p>
                  <p>💰 {formatearCOP(prod.precio)}</p>
                </Link>

                {/* Botón de agregar al carrito */}
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default Productos;