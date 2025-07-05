import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EstadoPago = () => {
  const { reference } = useParams(); // 📦 Referencia capturada de la URL
  const [estado, setEstado] = useState(null); // 🔁 Estado actual del pago
  const [ultimaConsulta, setUltimaConsulta] = useState(null); // 🕓 Timestamp de última verificación

  useEffect(() => {
    let intervalo;
    let delayInicial;

    const consultarEstado = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pago/${reference}`);

        if (res.ok) {
          const data = await res.json();
          setEstado(data.status); // ✅ Almacenamos el estado
          setUltimaConsulta(new Date().toLocaleTimeString()); // 🕓 Marcamos hora de consulta

          if (data.status !== "PENDING") {
            clearInterval(intervalo); // 🛑 Detenemos polling si ya tenemos resultado final
          }
        } else if (res.status === 404) {
          setEstado("NO_ENCONTRADO"); // ⚠️ No se encontró la referencia aún
          clearInterval(intervalo); // Opcional: detener también si referencia no existe
        }
      } catch (error) {
        console.error("❌ Error consultando estado:", error);
      }
    };

    // ⏱️ Esperamos 1.5 segundos antes de hacer la primera consulta (para dar tiempo a Mongo)
    delayInicial = setTimeout(() => {
      consultarEstado();
      intervalo = setInterval(consultarEstado, 3000); // 🔁 Polling cada 3s
    }, 1500);

    // 🧼 Limpieza de intervalos y timeouts al desmontar
    return () => {
      if (intervalo) clearInterval(intervalo);
      if (delayInicial) clearTimeout(delayInicial);
    };
  }, [reference]);

  // 🎨 Renderizamos según el estado actual
  const renderEstado = () => {
    switch (estado) {
      case "APPROVED":
        return (
          <div>
            <h2 style={{ color: "green" }}>🎉 ¡Gracias por tu compra!</h2>
            <p>Tu pago fue aprobado exitosamente.</p>
            <p>Te redirigiremos pronto o puedes volver a la tienda ahora mismo.</p>
          </div>
        );
      case "DECLINED":
        return <h2 style={{ color: "red" }}>❌ Pago rechazado</h2>;
      case "PENDING":
        return <h2 style={{ color: "orange" }}>⏳ Esperando confirmación...</h2>;
      case "NO_ENCONTRADO":
        return <h2 style={{ color: "gray" }}>⚠️ Referencia no encontrada</h2>;
      default:
        return estado === null
          ? <h2>🔍 Consultando estado...</h2>
          : <h2 style={{ color: "gray" }}>⚠️ Estado desconocido: {estado}</h2>;
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🧾 Estado del Pago</h1>
      <p>Referencia: <strong>{reference}</strong></p>

      {/* ♿ Accesibilidad para lectores de pantalla */}
      <div aria-live="polite">
        {renderEstado()}
      </div>

      {/* 🕓 Muestra la última hora de verificación */}
      {ultimaConsulta && (
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Última consulta: {ultimaConsulta}
        </p>
      )}

      {/* 🔁 Botón para volver a la tienda */}
      <button
        onClick={() => window.location.href = "/"}
        style={{ marginTop: "1.5rem", padding: "10px 20px", cursor: "pointer" }}
      >
        🔙 Volver a la tienda
      </button>
    </div>
  );
};

export default EstadoPago;
