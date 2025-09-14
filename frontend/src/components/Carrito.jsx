import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { showSuccess } from "../utils/toast";

const Carrito = () => {
  const { carrito, setCarrito } = useContext(CarritoContext);

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item._id !== id);
    setCarrito(nuevoCarrito);
    showSuccess("❌ Producto eliminado del carrito");
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const estilos = {
    contenedor: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "2rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      textAlign: "center"
    },
    lista: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem"
    },
    item: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      backgroundColor: "#fff",
      padding: "1rem",
      borderRadius: "8px",
      boxShadow: "0 0 5px rgba(0,0,0,0.05)"
    },
    imagen: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "6px",
      border: "1px solid #ddd"
    },
    info: {
      flex: 1,
      textAlign: "left"
    },
    nombre: {
      margin: 0,
      fontSize: "1.1rem"
    },
    texto: {
      margin: "4px 0",
      fontSize: "0.95rem"
    },
    boton: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer"
    },
    botonHover: {
      backgroundColor: "#c0392b"
    },
    total: {
      textAlign: "right",
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginTop: "1rem"
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h2>🛒 Tu carrito de compras</h2>

      {carrito.length === 0 ? (
        <p>🧺 El carrito está vacío. ¡Agrega productos para comenzar!</p>
      ) : (
        <div style={estilos.lista}>
          {carrito.map(item => (
            <div key={item._id} style={estilos.item}>
              <img
                src={item.imagenUrl || "/imagenes/default.jpg"}
                alt={item.nombre}
                style={estilos.imagen}
                onError={(e) => e.target.src = "/imagenes/default.jpg"}
              />
              <div style={estilos.info}>
                <h4 style={estilos.nombre}>{item.nombre}</h4>
                <p style={estilos.texto}>Cantidad: {item.cantidad}</p>
                <p style={estilos.texto}>
                  Precio:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0
                  }).format(item.precio)}
                </p>
                <button
                  style={estilos.boton}
                  onClick={() => eliminarDelCarrito(item._id)}
                >
                  ❌ Eliminar
                </button>
              </div>
            </div>
          ))}

          <h3 style={estilos.total}>
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
