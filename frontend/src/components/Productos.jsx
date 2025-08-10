import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";

function Productos() {
  const apiUrl = "https://wish-backend-l681.onrender.com";

  const [productos, setProductos] = useState([]);
  const { carrito, setCarrito } = useContext(CarritoContext);

  useEffect(() => {
    axios.get(`${apiUrl}/productos`)
      .then(res => setProductos(res.data))
      .catch(err => console.error("❌ Error al obtener productos:", err));
  }, []);

  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    setCarrito(nuevoCarrito);

    axios.post(`${apiUrl}/carrito`, {
      productoId: producto._id,
      cantidad: 1,
      total: producto.precio
    })
    .catch(err => console.error("❌ Error al agregar al carrito:", err));
  };

  return (
    <div className="contenedor-tienda">
      <h1 className="titulo-tienda">✨ WISH MARKETPLACE</h1>
      <p className="subtitulo-tienda">Tu deseo, un clic más cerca</p>

      <div className="grid-productos">
        {productos.map(prod => (
          <div className="card-producto" key={prod._id}>
            <img
              src={prod.imagenUrl || "/imagenes/default.jpg"}
              alt={prod.nombre}
              onError={(e) => e.target.src = "/imagenes/default.jpg"}
            />
            <h3>{prod.nombre}</h3>
            <p className="precio">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
              }).format(prod.precio)}
            </p>
            {typeof prod.stock === "number" && prod.stock > 0 && prod.stock < 6 && (
              <p className="stock">¡Solo quedan {prod.stock}!</p>
            )}
            {typeof prod.stock === "number" && prod.stock === 0 ? (
              <button className="agotado" disabled>Agotado</button>
            ) : (
              <button onClick={() => agregarAlCarrito(prod)}>🛒 Agregar al carrito</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;
