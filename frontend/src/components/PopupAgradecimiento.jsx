import React from 'react';
import './PopupAgradecimiento.css';

const PopupAgradecimiento = ({ nombreCliente, productos, total, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-contenido">
        <h2>¡Gracias por tu compra{nombreCliente ? `, ${nombreCliente}` : ''}!</h2>
        <p>Resumen de tu pedido:</p>
        <ul>
          {productos.map((p, i) => (
            <li key={i}>{p.nombre} x{p.cantidad}</li>
          ))}
        </ul>
        <p><strong>Total:</strong> ${total}</p>
        <div className="popup-botones">
          <button onClick={() => window.location.href = '/'}>Volver al inicio</button>
          <button onClick={onClose}>Seguir comprando</button>
        </div>
      </div>
    </div>
  );
};

export default PopupAgradecimiento;