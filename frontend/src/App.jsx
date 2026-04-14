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
import ProductoDetalle from "./components/ProductoDetalle"; // 👈 Importamos el detalle

import { CarritoProvider } from "./context/CarritoContext";

const App = () => {
  const [categoria, setCategoria] = useState("");
  const [modoOscuro, setModoOscuro] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setModoOscuro(mediaQuery.matches);

    const handleChange = (e) => setModoOscuro(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/productos`) // 👈 corregido para usar /api/productos
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Productos desde Mongo:", data);
        setProductos(data);
      })
      .catch((err) => console.error("❌ Error al cargar productos:", err));
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
          theme={temaToast}
        />

        <Routes>
          <Route path="/" element={null} />
          <Route
            path="/estado-pago/:referencia"
            element={<EstadoPago apiUrl={process.env.REACT_APP_API_URL} />}
          />
          <Route
            path="/producto/:id"
            element={<ProductoDetalle />} // 👈 nueva ruta para detalle
          />
        </Routes>
      </div>
    </CarritoProvider>
  );
};

export default App;