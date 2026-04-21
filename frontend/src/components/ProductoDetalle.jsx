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
        setImagenActiva(data.imagenes?.[0] || "/imagenes/default.jpg");
      })
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

  // 👉 Función de animación reutilizada
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
          opacity: 0
        }
      ],
      { duration: 800, easing: "ease-in-out" }
    ).onfinish = () => burbuja.remove();
  };

  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div className="detalle-producto">
      <div className="detalle-imagen-principal">
        <img src={imagenActiva} alt={producto.nombre} />
      </div>

      <div className="detalle-miniaturas">
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
        <button
          onClick={(e) => {
            agregarAlCarrito(producto);
            lanzarAnimacion(e.target, producto.imagenes?.[0]); // ✅ animación aquí
          }}
        >
          Agregar al carrito
        </button>
        <button onClick={() => navigate(-1)}>Regresar</button>
      </div>
    </div>
  );
};

export default ProductoDetalle;