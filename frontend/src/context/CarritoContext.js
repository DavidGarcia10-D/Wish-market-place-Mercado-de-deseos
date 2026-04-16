import React, { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ✅ Agregar producto sin duplicar
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p._id === producto._id);
      if (existe) {
        // Si ya existe, aumentamos la cantidad
        return prev.map((p) =>
          p._id === producto._id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      } else {
        // Si no existe, lo agregamos con cantidad = 1
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p._id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const modificarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p._id === id
          ? { ...p, cantidad: Math.max(p.cantidad + delta, 1) }
          : p
      )
    );
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, modificarCantidad }}
    >
      {children}
    </CarritoContext.Provider>
  );
};