import React from "react"; // 📌 Importamos React
import Productos from "./components/Productos"; // 📌 Importamos el componente Productos
import Carrito from "./components/Carrito"; // 📌 Importamos el carrito de compras
import Pago from "./components/Pago"; // 🔥 NUEVO: Importamos el componente de pago
import { CarritoProvider } from "./context/CarritoContext"; // 📌 Importamos el contexto global del carrito

const App = () => {
  return (
    // 📌 Envolvemos la aplicación con CarritoProvider para manejar el estado global del carrito
    <CarritoProvider>
      <div>
        <h1>Bienvenido a la tienda 🚀</h1>
        <Productos /> {/* 📌 Mostramos los productos disponibles en la tienda */}
        <Carrito usuarioId={"123456"} /> {/* 📌 Mostramos el carrito (puede usar un ID dinámico del usuario) */}

        {/* 🔥 NUEVO: Agregamos el formulario de pago debajo del carrito 🔥 */}
        <Pago />

      </div>
    </CarritoProvider>
  );
};

export default App; // 📌 Exportamos App para que se pueda renderizar en el navegador
