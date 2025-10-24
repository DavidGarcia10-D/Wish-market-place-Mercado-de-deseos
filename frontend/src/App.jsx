// frontend/src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Productos from "./components/Productos";
import Carrito from "./components/Carrito";
import Pago from "./components/Pago";
import EstadoPago from "./components/EstadoPago";
import Categoria from "./components/Categoria";

import { CarritoProvider } from "./context/CarritoContext";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <CarritoProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="contenedor-tienda">
                {/* 🛍️✨ Título mágico del sitio */}
                <header style={{ textAlign: "center", margin: "2rem 0" }}>
                  <h1 className="titulo-tienda">
                    🛍️ 🪄✨ Wish Marketplace ✨🪄 🛍️
                  </h1>
                  <p className="subtitulo-tienda">Mercado de deseos</p>
                </header>

                {/* 🗂️ Selector de categoría */}
                <Categoria
                  setCategoria={setCategoriaSeleccionada}
                  categoriaSeleccionada={categoriaSeleccionada}
                />

                {/* 🛒 Listado de productos */}
                <Productos
                  apiUrl={API_URL}
                  categoria={categoriaSeleccionada}
                />

                {/* 🧺 Carrito de compras */}
                <Carrito apiUrl={API_URL} usuarioId={"123456"} />

                {/* 💳 Formulario de pago */}
                <Pago apiUrl={API_URL} />

                {/* 🔔 Toasts de feedback visual */}
                <ToastContainer position="top-right" autoClose={3000} />
              </div>
            }
          />

          {/* ✅ Ruta para estado de pago */}
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
