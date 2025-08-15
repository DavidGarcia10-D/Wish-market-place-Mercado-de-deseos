import React, { useEffect, useState } from "react";

const ResumenPago = ({ reference, apiUrl }) => {
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const res = await fetch(`${apiUrl}/pago/${reference}`);
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
  }, [reference, apiUrl]);

  if (cargando) return <div className="spinner" />;
  if (error || !detalle)
    return <p style={{ color: "crimson" }}>🚨 No se pudo cargar el resumen del pago.</p>;

  return (
    <div className="resumen-pago">
      <h3>📋 Detalles del Pago</h3>
      <ul>
        <li><strong>Referencia:</strong> {detalle.reference || "—"}</li>
        <li><strong>Estado:</strong> {detalle.status || "Desconocido"}</li>
        <li>
          <strong>Monto:</strong>{" "}
          {typeof detalle.amount_in_cents === "number"
            ? `$ ${(detalle.amount_in_cents / 100).toLocaleString("es-CO", { minimumFractionDigits: 2 })} COP`
            : "No disponible"}
        </li>
        <li>
          <strong>Fecha:</strong>{" "}
          {detalle.createdAt
            ? new Date(detalle.createdAt).toLocaleString("es-CO")
            : detalle.created_at
              ? new Date(detalle.created_at).toLocaleString("es-CO")
              : "No registrada"}
        </li>
        {detalle.bank_name && <li><strong>Banco:</strong> {detalle.bank_name}</li>}
        {detalle.user_email && <li><strong>Correo:</strong> {detalle.user_email}</li>}
        {detalle.payment_method_type && (
          <li><strong>Método:</strong> {detalle.payment_method_type.toUpperCase()}</li>
        )}
        {typeof detalle.attempts === "number" && (
          <li><strong>Intentos:</strong> {detalle.attempts}</li>
        )}
        {detalle.reject_reason && (
          <li><strong>Motivo del rechazo:</strong> {detalle.reject_reason}</li>
        )}
      </ul>
    </div>
  );
};

export default ResumenPago;
