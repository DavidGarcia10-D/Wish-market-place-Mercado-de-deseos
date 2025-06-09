// Importamos las dependencias necesarias
import { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react"; // 📌 Importamos useContext para usar el estado global del carrito
import { CarritoContext } from "../context/CarritoContext"; // 📌 Importamos el contexto del carrito

function Productos() {
  // Estado para almacenar los productos obtenidos desde la API
  const [productos, setProductos] = useState([]);
  const { carrito, setCarrito } = useContext(CarritoContext); // 📌 Accedemos al estado global del carrito

  // Efecto que ejecuta la solicitud a la API cuando el componente se monta
  useEffect(() => {
    axios.get("http://localhost:3000/productos")  // 🔍 Llamada a la API
      .then(res => setProductos(res.data))  // 📥 Guardamos la respuesta en el estado
      .catch(err => console.error("Error al obtener productos:", err));  // ⚠️ Manejo de errores
  }, []);  // 📌 El array vacío `[]` asegura que se ejecute solo una vez al montar el componente

  // 📌 Función para agregar productos al carrito
  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }]; // 📌 Agregamos el producto con cantidad inicial 1
    setCarrito(nuevoCarrito); // 📌 Actualizamos el estado global del carrito

    // 📌 Enviamos el producto al backend para guardar el carrito
    axios.post("http://localhost:3000/carrito", { 
        productoId: producto._id, 
        cantidad: 1, 
        total: producto.precio 
    })  
      .catch(err => console.error("❌ Error al agregar al carrito:", err));  
  };

  return (
    <div>
      <h1>🚀 Bienvenido a la tienda</h1>
      
      {/* Contenedor flexible para mostrar los productos en tarjetas */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {productos.map(prod => (  // 🔄 Iteramos sobre los productos obtenidos
          <div key={prod._id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <h2>{prod.nombre}</h2>  {/* 📌 Nombre del producto */}
            
            {/* 📸 Imagen del producto (se asegura que la URL sea válida) */}
            <img src={prod.imagenUrl} alt={prod.nombre} width="100%" />
            
            <p><strong>Precio:</strong> ${prod.precio} USD</p>  {/* 💲 Precio */}
            <p><strong>Stock:</strong> {prod.stock} unidades</p>  {/* 🔢 Stock disponible */}
            
            {/* 📌 Botón para agregar productos al carrito */}
            <button onClick={() => agregarAlCarrito(prod)}>🛒 Agregar al carrito</button>  
          </div>
        ))}
      </div>
    </div>
  );
}

// Exportamos el componente para usarlo en otras partes del frontend
export default Productos;
