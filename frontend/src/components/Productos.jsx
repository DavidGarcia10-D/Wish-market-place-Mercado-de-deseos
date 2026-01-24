import React, { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import "./Productos.css";

const Productos = ({ apiUrl, categoria }) => {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const url = categoria
      ? `${apiUrl}/productos?categoria=${encodeURIComponent(categoria)}`
      : `${apiUrl}/productos`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, [apiUrl, categoria]);

  const formatCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  return (
    <div className="contenedor-productos">
      <h2 className="titulo-productos">🛍️ Nuestros productos</h2>
      <div className="grid-productos">
        {productos.length === 0 ? (
          <p style={{ color: "#888" }}>No hay productos disponibles.</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id} className="card-producto">
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>Precio: {formatCOP(producto.precio)}</p>
              <button
                className="boton-agregar"
                onClick={() => agregarAlCarrito(producto)}
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