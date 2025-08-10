import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";

const Carrito = () => {
  const { carrito, setCarrito } = useContext(CarritoContext);

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item._id !== id);
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="contenedor-carrito">
      <h2>🛒 Tu carrito de compras</h2>

      {carrito.length === 0 ? (
        <p>🧺 El carrito está vacío. ¡Agrega productos para comenzar!</p>
      ) : (
        <div className="lista-carrito">
          {carrito.map(item => (
            <div key={item._id} className="item-carrito">
              <img
                src={item.imagenUrl || "/imagenes/default.jpg"}
                alt={item.nombre}
                onError={(e) => e.target.src = "/imagenes/default.jpg"}
              />
              <div className="info-item">
                <h4>{item.nombre}</h4>
                <p>Cantidad: {item.cantidad}</p>
                <p>
                  Precio:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0
                  }).format(item.precio)}
                </p>
                <button onClick={() => eliminarDelCarrito(item._id)}>❌ Eliminar</button>
              </div>
            </div>
          ))}

          <h3 className="total-carrito">
            Total:{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0
            }).format(total)}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Carrito;
