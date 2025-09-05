import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Productos.css";
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
  }, [categoria]);

  return (
    <div className="contenedor-productos">
      <h2 className="titulo-productos">
        {categoria ? `🛍️ Productos de ${categoria}` : "🛍️ Todos los productos"}
      </h2>

      <div className="grid-productos">
        {productos.length === 0 ? (
          <p>No hay productos disponibles en esta categoría.</p>
        ) : (
          productos.map((prod) => (
            <div key={prod._id} className="card-producto">
              <img
                src={prod.imagenUrl}
                alt={prod.nombre}
                onError={(e) => (e.target.src = "/imagenes/default.jpg")}
              />
              <h3>{prod.nombre}</h3>
              <p>{prod.descripcion}</p>
              <p><strong>${prod.precio.toLocaleString()}</strong></p>
              <p>Stock: {prod.stock}</p>
              <button
                className="boton-agregar"
                onClick={() => agregarAlCarrito(prod)}
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
  