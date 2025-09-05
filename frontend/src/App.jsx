// frontend/src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
              <div>
                <Categoria
                  setCategoria={setCategoriaSeleccionada}
                  categoriaSeleccionada={categoriaSeleccionada}
                />
                <Productos
                  apiUrl={API_URL}
                  categoria={categoriaSeleccionada}
                />
                <Carrito apiUrl={API_URL} usuarioId={"123456"} />
                <Pago apiUrl={API_URL} />
              </div>
            }
          />
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
