import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Productos from "./components/Productos";
import Categoria from "./components/Categoria";
import Carrito from "./components/Carrito";
import { CarritoProvider } from "./context/CarritoContext";

const App = () => {
  const [categoria, setCategoria] = useState("");

  return (
    <CarritoProvider>
      <div style={{ padding: "2rem" }}>
        <Categoria setCategoria={setCategoria} categoriaSeleccionada={categoria} />
        <Carrito />
        <Routes>
          <Route
            path="/"
            element={<Productos apiUrl={process.env.REACT_APP_API_URL} categoria={categoria} />}
          />
        </Routes>
      </div>
    </CarritoProvider>
  );
};

export default App;