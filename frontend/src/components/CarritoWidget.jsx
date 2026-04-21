import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./CarritoWidget.css";

const CarritoWidget = ({ modoOscuro }) => {
  const { carrito } = useCarrito();
  const location = useLocation();
  const navigate = useNavigate();
  const [animar, setAnimar] = useState(false);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Efecto rebote cuando cambia el contador
  useEffect(() => {
    if (totalItems > 0) {
      setAnimar(true);
      const timer = setTimeout(() => setAnimar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  // ✅ El return condicional va después de los hooks
  if (location.pathname === "/pago") {
    return null;
  }

  return (
    <div
      className={`carrito-widget ${modoOscuro ? "oscuro" : "claro"}`}
      onClick={() => navigate("/carrito")}
      title="Ver carrito"
    >
      <span className="carrito-widget-icono">🛒</span> {/* ✅ destino de la animación */}
      {totalItems > 0 && (
        <span
          className={`carrito-widget-contador ${animar ? "rebote" : ""}`}
        >
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CarritoWidget;