import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Productos from "./components/Productos";
import Categoria from "./components/Categoria";
import Carrito from "./components/Carrito";
import Pago from "./components/Pago";
import EstadoPago from "./components/EstadoPago";
import ProductoDetalle from "./components/ProductoDetalle";
import CarritoWidget from "./components/CarritoWidget";

import { CarritoProvider } from "./context/CarritoContext";

const App = () => {
  const [categoria, setCategoria] = useState("");
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setModoOscuro(mediaQuery.matches);
    const handleChange = (e) => setModoOscuro(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const temaToast = useMemo(() => (modoOscuro ? "dark" : "light"), [modoOscuro]);

  return (
    <CarritoProvider>
      <div className="contenedor-tienda">
        <h1 className="titulo-tienda">🛒 Wish Marketplace</h1>
        <p className="subtitulo-tienda">Tecnología y estilo en un solo lugar</p>

        <Categoria
          setCategoria={setCategoria}
          categoriaSeleccionada={categoria}
        />

        <Routes>
          {/* Página principal con productos */}
          <Route
            path="/"
            element={
              <Productos
                apiUrl={process.env.REACT_APP_API_URL}
                categoria={categoria}
              />
            }
          />

          {/* Carrito */}
          <Route
            path="/carrito"
            element={<Carrito apiUrl={process.env.REACT_APP_API_URL} usuarioId="123456" />}
          />

          {/* Pago */}
          <Route
            path="/pago"
            element={<Pago apiUrl={process.env.REACT_APP_API_URL} />}
          />

          {/* Estado del pago */}
          <Route
            path="/estado-pago/:referencia"
            element={<EstadoPago apiUrl={process.env.REACT_APP_API_URL} />}
          />

          {/* Detalle de producto */}
          <Route path="/producto/:id" element={<ProductoDetalle />} />
        </Routes>

        {/* Widget fijo en todas las pantallas excepto /pago */}
        <CarritoWidget modoOscuro={modoOscuro} />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme={temaToast}
        />
      </div>
    </CarritoProvider>
  );
};

export default App;