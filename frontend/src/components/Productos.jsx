import React, { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { Link } from "react-router-dom";
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
        console.log("📦 Productos recibidos desde backend:", data);
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

  // 👉 Animación burbuja al carrito
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
          productos.map((prod) => {
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
                key={prod._id}
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
          })
        )}
      </div>
    </div>
  );
};

export default Productos;