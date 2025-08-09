import React, { useEffect, useState } from "react";

const ResumenPago = ({ reference }) => {
  const [detalle, setDetalle] = useState(null);     // 📦 Detalle del pago recibido del backend
  const [error, setError] = useState(false);        // ⚠️ Control de errores
  const [cargando, setCargando] = useState(true);   // ⏳ Indicador de carga

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pago/${reference}`);
        if (!res.ok) throw new Error("No se pudo obtener el detalle");
        const data = await res.json();
        setDetalle(data);
      } catch (err) {
        console.error("❌ Error obteniendo el resumen:", err);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerDetalle();
  }, [reference]);

  if (cargando) return <p>⏳ Cargando resumen…</p>;
  if (error || !detalle) return <p style={{ color: "crimson" }}>🚨 No se pudo cargar el resumen del pago.</p>;

  return (
    <div style={{
      marginTop: "2rem",
      border: "1px solid #ccc",
      padding: "1rem",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      maxWidth: "450px",
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      <h3 style={{ marginBottom: "1rem" }}>📋 Detalles del Pago</h3>

      <p><strong>Referencia:</strong> {detalle.reference || "—"}</p>
      <p><strong>Estado:</strong> {detalle.status || "Desconocido"}</p>

      <p>
        <strong>Monto:</strong>{" "}
        {typeof detalle.amount_in_cents === "number"
          ? `$ ${(detalle.amount_in_cents / 100).toLocaleString("es-CO", { minimumFractionDigits: 2 })} COP`
          : "No disponible"}
      </p>

      <p>
        <strong>Fecha:</strong>{" "}
        {detalle.createdAt
          ? new Date(detalle.createdAt).toLocaleString("es-CO")
          : detalle.created_at
            ? new Date(detalle.created_at).toLocaleString("es-CO")
            : "No registrada"}
      </p>

      {detalle.bank_name && <p><strong>Banco:</strong> {detalle.bank_name}</p>}
      {detalle.user_email && <p><strong>Correo:</strong> {detalle.user_email}</p>}
      {detalle.payment_method_type && (
        <p><strong>Método:</strong> {detalle.payment_method_type.toUpperCase()}</p>
      )}
      {typeof detalle.attempts === "number" && (
        <p><strong>Intentos:</strong> {detalle.attempts}</p>
      )}
      {detalle.reject_reason && <p><strong>Motivo del rechazo:</strong> {detalle.reject_reason}</p>}
    </div>
  );
};

export default ResumenPago;
