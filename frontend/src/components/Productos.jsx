import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";

function Productos({ apiUrl, categoria }) {
  const [productos, setProductos] = useState([]);
  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const endpoint = categoria
          ? `${apiUrl}/api/productos/categoria/${categoria}`
          : `${apiUrl}/productos`;

        const res = await axios.get(endpoint);
        setProductos(res.data);
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      }
    };

    obtenerProductos();
  }, [categoria, apiUrl]);

  const handleAgregar = (producto) => {
    if (typeof agregarAlCarrito === "function") {
      agregarAlCarrito(producto);
    } else {
      console.error("❌ agregarAlCarrito no está definido como función");
    }
  };

  const estilos = {
    contenedor: {
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    titulo: {
      textAlign: "center",
      fontSize: "2rem",
      marginBottom: "2rem",
      color: "#333"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "2rem"
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 0 10px rgba(0,0,0,0.05)",
      padding: "1rem",
      textAlign: "center",
      transition: "transform 0.2s ease"
    },
    imagen: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "1rem",
      border: "1px solid #eee"
    },
    nombre: {
      fontSize: "1.2rem",
      margin: "0.5rem 0"
    },
    descripcion: {
      fontSize: "0.9rem",
      color: "#666",
      marginBottom: "0.5rem"
    },
    precio: {
      fontWeight: "bold",
      fontSize: "1rem",
      marginBottom: "0.5rem"
    },
    stock: {
      fontSize: "0.85rem",
      color: "#888",
      marginBottom: "1rem"
    },
    boton: {
      backgroundColor: "#3498db",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      cursor: "pointer"
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h2 style={estilos.titulo}>
        {categoria ? `🛍️ Productos de ${categoria}` : "🛍️ Todos los productos"}
      </h2>

      <div style={estilos.grid}>
        {productos.length === 0 ? (
          <p>No hay productos disponibles en esta categoría.</p>
        ) : (
          productos.map((prod) => (
            <div key={prod._id} style={estilos.card}>
              <img
                src={prod.imagenUrl}
                alt={prod.nombre}
                style={estilos.imagen}
                onError={(e) => (e.target.src = "/imagenes/default.jpg")}
              />
              <h3 style={estilos.nombre}>{prod.nombre}</h3>
              <p style={estilos.descripcion}>{prod.descripcion}</p>
              <p style={estilos.precio}>${prod.precio.toLocaleString()}</p>
              <p style={estilos.stock}>Stock: {prod.stock}</p>
              <button
                style={estilos.boton}
                onClick={() => handleAgregar(prod)}
              >
                Agregar al carrito
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Productos;
