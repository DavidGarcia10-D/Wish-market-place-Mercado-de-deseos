import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css"; // ✅ Importa tus estilos personalizados



import Productos from "./components/Productos";
import Categoria from "./components/Categoria";
import Carrito from "./components/Carrito";
import Pago from "./components/Pago";
import EstadoPago from "./components/EstadoPago";

import { CarritoProvider } from "./context/CarritoContext";

const App = () => {
  const [categoria, setCategoria] = useState("");

  return (
    <CarritoProvider>
      <div className="contenedor-tienda">
        <h1 className="titulo-tienda">🛒 Wish Marketplace</h1>
        <p className="subtitulo-tienda">Tecnología y estilo en un solo lugar</p>

        <Categoria
          setCategoria={setCategoria}
          categoriaSeleccionada={categoria}
        />

        <Productos
          apiUrl={process.env.REACT_APP_API_URL}
          categoria={categoria}
        />

        <Carrito
          apiUrl={process.env.REACT_APP_API_URL}
          usuarioId="123456"
        />

        <Pago apiUrl={process.env.REACT_APP_API_URL} />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="auto"
        />

        <Routes>
          <Route path="/" element={null} />
          <Route
            path="/estado-pago/:referencia"
            element={<EstadoPago apiUrl={process.env.REACT_APP_API_URL} />}
          />
        </Routes>
      </div>
    </CarritoProvider>
  );
};

export default App;