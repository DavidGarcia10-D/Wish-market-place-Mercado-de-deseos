// 🌐 Importamos React y herramientas de routing
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Importamos componentes de la app
import Productos from "./components/Productos";
import Carrito from "./components/Carrito";
import Pago from "./components/Pago";
import EstadoPago from "./components/EstadoPago";

// 🌍 Contexto global para el carrito
import { CarritoProvider } from "./context/CarritoContext";

// 🎨 Importamos estilos globales (asegúrate de que App.css existe)
import "./App.css";

const App = () => {
  return (
    <CarritoProvider>
      <Router>
        <Routes>
          {/* 🏠 Ruta principal: catálogo, carrito y pago */}
          <Route
            path="/"
            element={
              <div>
                {/* 👇 Eliminamos el h1 aquí porque el título ya está incluido en <Productos /> */}
                <Productos />
                <Carrito usuarioId={"123456"} />
                <Pago />
              </div>
            }
          />

          {/* 📄 Ruta dinámica para mostrar estado del pago */}
          <Route path="/estado/:reference" element={<EstadoPago />} />
        </Routes>
      </Router>
    </CarritoProvider>
  );
};

export default App;
