import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// 📥 Importamos el componente de resumen del pago
import ResumenPago from "./ResumenPago";

const EstadoPago = ({ apiUrl }) => {
  const { reference } = useParams(); // 📦 Capturamos la referencia desde la URL
  const [estado, setEstado] = useState(null); // 🔁 Estado actual del pago
  const [ultimaConsulta, setUltimaConsulta] = useState(null); // 🕓 Timestamp del último polling
  const [errorConsulta, setErrorConsulta] = useState(false); // ⚠️ Si ocurre un error en la consulta

  useEffect(() => {
    let intervalo;
    let delayInicial;

    // 🔍 Función que consulta al backend por el estado del pago
    const consultarEstado = async () => {
      try {
        const res = await fetch(`${apiUrl}/pago/${reference}`);
        if (!res.ok) {
          if (res.status === 404) setEstado("NO_ENCONTRADO");
          else setErrorConsulta(true);
          clearInterval(intervalo);
          return;
        }

        const data = await res.json();
        setEstado(data.status);
        setUltimaConsulta(new Date().toLocaleTimeString());
        if (data.status !== "PENDING") clearInterval(intervalo);
      } catch (error) {
        console.error("❌ Error en la consulta:", error);
        setErrorConsulta(true);
        clearInterval(intervalo);
      }
    };

    // ⏱️ Iniciamos la primera consulta con un delay para evitar conflictos con el guardado en MongoDB
    delayInicial = setTimeout(() => {
      consultarEstado();
      intervalo = setInterval(consultarEstado, 3000); // 🔁 Polling cada 3 segundos
    }, 1500);

    // 🧼 Cleanup al desmontar el componente
    return () => {
      clearInterval(intervalo);
      clearTimeout(delayInicial);
    };
  }, [reference, apiUrl]);

  // 🎨 Visualización según estado del pago
  const renderEstado = () => {
    if (errorConsulta) {
      return <h2 style={{ color: "crimson" }}>🚨 Error al consultar el estado del pago</h2>;
    }

    switch (estado) {
      case "APPROVED":
        return (
          <div>
            <h2 style={{ color: "green" }}>🎉 ¡Pago aprobado!</h2>
            <p>Gracias por tu compra.</p>
            {/* 🧾 Resumen detallado de la transacción */}
            <ResumenPago reference={reference} apiUrl={apiUrl} />
          </div>
        );

      case "DECLINED":
        return (
          <div>
            <h2 style={{ color: "red" }}>❌ Transacción rechazada</h2>
            <p>Por favor intenta nuevamente con otro banco.</p>
          </div>
        );

      case "PENDING":
        return <h2 style={{ color: "orange" }}>⏳ Esperando confirmación del banco…</h2>;

      case "NO_ENCONTRADO":
        return <h2 style={{ color: "gray" }}>⚠️ Referencia no encontrada</h2>;

      case null:
        return <h2>🔍 Consultando estado del pago…</h2>;

      default:
        return <h2 style={{ color: "gray" }}>📌 Estado desconocido: {estado}</h2>;
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🧾 Estado del Pago</h1>
      <p>Referencia: <strong>{reference}</strong></p>

      {/* ♿ Zona que se actualiza dinámicamente */}
      <div aria-live="polite" role="status">
        {renderEstado()}
      </div>

      {/* 🕓 Timestamp útil para debug o UX */}
      {ultimaConsulta && (
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Última verificación: {ultimaConsulta}
        </p>
      )}

      {/* 🔁 Acción para volver a la tienda */}
      <button
        onClick={() => window.location.href = "/"}
        style={{
          marginTop: "1.5rem",
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        🔙 Volver a la tienda
      </button>
    </div>
  );
};

export default EstadoPago;
