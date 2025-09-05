// 🌐 Importamos React y herramientas de routing
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🧩 Importamos componentes de la app
import Productos from "./components/Productos";
import Carrito from "./components/Carrito";
import Pago from "./components/Pago";
import EstadoPago from "./components/EstadoPago";
import Categoria from "./components/Categoria"; // ← nuevo import

// 🌍 Contexto global para el carrito
import { CarritoProvider } from "./context/CarritoContext";

// 🎨 Importamos estilos globales
import "./App.css";

// 🔗 Importamos la URL del backend desde .env
const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  return (
    <CarritoProvider>
      <Router>
        <Routes>
          {/* 🏠 Ruta principal: catálogo, categorías, carrito y pago */}
          <Route
            path="/"
            element={
              <div>
                <Categoria /> {/* ✅ Se muestra al inicio */}
                <Productos apiUrl={API_URL} />
                <Carrito apiUrl={API_URL} usuarioId={"123456"} />
                <Pago apiUrl={API_URL} />
              </div>
            }
          />

          {/* 📁 Ruta dinámica para productos por categoría */}
          <Route
            path="/productos/:nombre"
            element={<Productos apiUrl={API_URL} />}
          />

          {/* 📄 Ruta dinámica para mostrar estado del pago */}
          <Route
            path="/estado/:reference"
            element={<EstadoPago apiUrl={API_URL} />}
          />
        </Routes>
      </Router>
    </CarritoProvider>
  );
};

export default App;
