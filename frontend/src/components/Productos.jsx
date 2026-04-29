import React, { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import CardProducto from "./CardProducto"; // ✅ nuevo componente
import "./Productos.css";

const Productos = ({ apiUrl, categoria }) => {
  const { agregarAlCarrito } = useCarrito();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const endpoint = categoria
          ? `${apiUrl}/api/productos/categoria/${categoria}`
          : `${apiUrl}/api/productos`;

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

  const lanzarAnimacion = (elemento, imagenProducto) => {
    const carritoIcono = document.querySelector(".carrito-widget-icono");
    if (!carritoIcono) return;

    const rectProducto = elemento.getBoundingClientRect();
    const rectCarrito = carritoIcono.getBoundingClientRect();

    const burbuja = document.createElement("div");
    burbuja.className = "burbuja-animada";
    burbuja.style.left = rectProducto.left + "px";
    burbuja.style.top = rectProducto.top + "px";

    if (imagenProducto) {
      burbuja.style.backgroundImage = `url(${imagenProducto})`;
      burbuja.style.backgroundSize = "cover";
      burbuja.style.backgroundPosition = "center";
    }

    document.body.appendChild(burbuja);

    burbuja.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${rectCarrito.left - rectProducto.left}px, 
                                ${rectCarrito.top - rectProducto.top}px) scale(0.3)`,
          opacity: 0,
        },
      ],
      {
        duration: 800,
        easing: "ease-in-out",
      }
    ).onfinish = () => {
      burbuja.remove();
    };
  };

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
            <CardProducto
              key={prod._id}
              prod={prod}
              agregarAlCarrito={agregarAlCarrito}
              lanzarAnimacion={lanzarAnimacion}
              formatearCOP={formatearCOP}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Productos;