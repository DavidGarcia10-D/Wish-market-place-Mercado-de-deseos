import React, { createContext, useState, useContext } from "react";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    const productoConCantidad = { ...producto, cantidad: 1 };
    setCarrito((prevCarrito) => [...prevCarrito, productoConCantidad]);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, setCarrito, agregarAlCarrito, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// ✅ Hook personalizado para usar el contexto
export const useCarrito = () => {
  return useContext(CarritoContext);
};