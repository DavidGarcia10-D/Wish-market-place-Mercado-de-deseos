import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./CarritoWidget.css";

const CarritoWidget = ({ modoOscuro }) => {
  const { carrito } = useCarrito();
  const location = useLocation();
  const navigate = useNavigate();
  const [animar, setAnimar] = useState(false);

  // Ocultar el widget en la pantalla de pago
  if (location.pathname === "/pago") return null;

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Efecto rebote cuando cambia el contador
  useEffect(() => {
    if (totalItems > 0) {
      setAnimar(true);
      const timer = setTimeout(() => setAnimar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <div
      className={`carrito-widget ${modoOscuro ? "oscuro" : "claro"}`}
      onClick={() => navigate("/carrito")}
      title="Ver carrito"
    >
      🛒
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