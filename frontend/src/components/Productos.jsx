import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import "./Productos.css";

const Productos = ({ productos }) => {
  const { agregarAlCarrito } = useContext(CarritoContext);

  return (
    <div className="contenedor-productos">
      <h2 className="titulo-productos">🛍️ Nuestros productos</h2>
      <div className="grid-productos">
        {productos.map((producto) => (
          <div key={producto.id} className="card-producto">
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>Precio: {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
            }).format(producto.precio)}</p>
            <button
              className="boton-agregar"
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;