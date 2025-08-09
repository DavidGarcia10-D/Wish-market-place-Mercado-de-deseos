// 📦 Importamos React y dependencias necesarias
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext"; // 🛒 Accedemos al contexto global del carrito

function Productos() {
  // 🔐 Estado local para almacenar productos desde el backend
  const [productos, setProductos] = useState([]);

  // 🧠 Estado del carrito y función para modificarlo
  const { carrito, setCarrito } = useContext(CarritoContext);

  // 🔄 Obtener productos desde el backend al montar el componente
  useEffect(() => {
    axios.get("http://localhost:3000/productos")
      .then(res => setProductos(res.data))
      .catch(err => console.error("❌ Error al obtener productos:", err));
  }, []);

  // 🛒 Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    setCarrito(nuevoCarrito);

    // 📤 También enviamos la info al backend
    axios.post("http://localhost:3000/carrito", {
      productoId: producto._id,
      cantidad: 1,
      total: producto.precio
    })
    .catch(err => console.error("❌ Error al agregar al carrito:", err));
  };

  return (
    <div className="contenedor-tienda">
      {/* 🛍️ Branding y bienvenida */}
      <h1 className="titulo-tienda">✨ WISH MARKETPLACE</h1>
      <p className="subtitulo-tienda">Tu deseo, un clic más cerca</p>

      {/* 🧱 Grilla de productos */}
      <div className="grid-productos">
        {productos.map(prod => (
          <div className="card-producto" key={prod._id}>
            {/* 📸 Imagen del producto o imagen por defecto */}
            <img
              src={prod.imagenUrl || "/imagenes/default.jpg"}
              alt={prod.nombre}
              onError={(e) => e.target.src = "/imagenes/default.jpg"}
            />

            {/* 🏷️ Nombre y precio en pesos colombianos */}
            <h3>{prod.nombre}</h3>
            <p className="precio">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0
              }).format(prod.precio)}
            </p>

            {/* 🔢 Stock dinámico solo si se desea mostrar */}
            {typeof prod.stock === "number" && prod.stock > 0 && prod.stock < 6 && (
              <p className="stock">¡Solo quedan {prod.stock}!</p>
            )}

            {/* ⛔ Producto agotado vs botón activo */}
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
