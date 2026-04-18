import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./CarritoWidget.css";

const CarritoWidget = ({ modoOscuro }) => {
  const { carrito } = useCarrito();
  const location = useLocation();
  const navigate = useNavigate();

  // Ocultar el widget en la pantalla de pago
  if (location.pathname === "/pago") return null;

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div
      className={`carrito-widget ${modoOscuro ? "oscuro" : "claro"}`}
      onClick={() => navigate("/carrito")}
      title="Ver carrito"
    >
      🛒
      {totalItems > 0 && (
        <span className="carrito-widget-contador">{totalItems}</span>
      )}
    </div>
  );
};

export default CarritoWidget;