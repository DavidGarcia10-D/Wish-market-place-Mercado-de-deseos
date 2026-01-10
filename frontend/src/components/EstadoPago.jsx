import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ResumenPago from "./ResumenPago";
import PopupAgradecimiento from "./PopupAgradecimiento";
import { CarritoContext } from "../context/CarritoContext";

const EstadoPago = ({ apiUrl }) => {
  const { reference } = useParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState(null);
  const [ultimaConsulta, setUltimaConsulta] = useState(null);
  const [errorConsulta, setErrorConsulta] = useState(false);
  const [pago, setPago] = useState(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const { carrito, total } = useContext(CarritoContext);

  useEffect(() => {
    if (!apiUrl || !reference) {
      console.warn("⚠️ apiUrl o reference no están definidos en EstadoPago");
      return;
    }

    let intervalo;
    let delayInicial;

    const consultarEstado = async () => {
      try {
        const res = await fetch(`${apiUrl}/pago/${reference}`);
        if (!res.ok) {
          if (res.status === 404) {
            setEstado("NO_ENCONTRADO");
            toast.warn("⚠️ Referencia no encontrada");
          } else {
            setErrorConsulta(true);
            toast.error("❌ Error al consultar el estado del pago");
          }
          clearInterval(intervalo);
          return;
        }

        const data = await res.json();
        console.log("📥 Estado del pago:", data.status);
        console.log("🧾 Detalles del pago:", data);

        setEstado(data.status);
        setPago(data);
        setUltimaConsulta(new Date().toLocaleTimeString());

        if (data.status !== "PENDING") {
          clearInterval(intervalo);
        }

        if (data.status === "APPROVED") {
          toast.success("✅ Pago aprobado");
          setMostrarPopup(true);
          console.log("🟢 Popup debería mostrarse ahora");
        } else if (data.status === "DECLINED") {
          toast.error("❌ Pago rechazado");
        } else if (data.status === "PENDING") {
          toast.info("⏳ Pago en proceso");
        }

      } catch (error) {
        console.error("❌ Error en la consulta:", error);
        setErrorConsulta(true);
        toast.error("❌ Error al consultar el estado del pago");
        clearInterval(intervalo);
      }
    };

    delayInicial = setTimeout(() => {
      consultarEstado();
      intervalo = setInterval(consultarEstado, 3000);
    }, 1500);

    return () => {
      clearInterval(intervalo);
      clearTimeout(delayInicial);
    };
  }, [reference, apiUrl]);

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
            <ResumenPago pago={pago} />
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
        return (
          <div>
            <h2 style={{ color: "orange" }}>⏳ Esperando confirmación del banco…</h2>
            <div className="spinner" style={{
              margin: "1rem auto",
              width: "40px",
              height: "40px",
              border: "4px solid #ccc",
              borderTop: "4px solid orange",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
          </div>
        );

      case "NO_ENCONTRADO":
        return <h2 style={{ color: "gray" }}>⚠️ Referencia no encontrada</h2>;

      case null:
        return (
          <div>
            <h2>🔍 Consultando estado del pago…</h2>
            <div className="spinner" />
          </div>
        );

      default:
        return <h2 style={{ color: "gray" }}>📌 Estado desconocido: {estado}</h2>;
    }
  };

  console.log("📊 mostrarPopup:", mostrarPopup, "pago:", pago, "carrito:", carrito, "total:", total);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🧾 Estado del Pago</h1>
      <p>Referencia: <strong>{reference}</strong></p>

      <div aria-live="polite" role="status">
        {renderEstado()}
      </div>

      {ultimaConsulta && (
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          Última verificación: {ultimaConsulta}
        </p>
      )}

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "1.5rem",
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        🔙 Volver a la tienda
      </button>

      {mostrarPopup && (
        <PopupAgradecimiento
          nombreCliente={pago?.nombre}
          productos={carrito}
          total={total}
          onClose={() => setMostrarPopup(false)}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EstadoPago;