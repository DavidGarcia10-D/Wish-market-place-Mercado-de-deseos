import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Productos from "./components/Productos";
import Carrito from "./components/Carrito";
import Pago from "./components/Pago";
import EstadoPago from "./components/EstadoPago";

import { CarritoProvider } from "./context/CarritoContext";

const App = () => {
  return (
    <CarritoProvider>
      <Router>
        <Routes>
          {/* 🏠 Ruta principal: productos, carrito y pago */}
          <Route
            path="/"
            element={
              <div>
                <h1>Bienvenido a la tienda 🚀</h1>
                <Productos />
                <Carrito usuarioId={"123456"} />
                <Pago />
              </div>
            }
          />

          {/* 📄 Ruta dinámica para estado del pago */}
          <Route path="/estado/:reference" element={<EstadoPago />} />
        </Routes>
      </Router>
    </CarritoProvider>
  );
};

export default App;

