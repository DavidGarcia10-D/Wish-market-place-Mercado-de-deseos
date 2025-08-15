import React, { useEffect, useState } from "react";

const ResumenPago = ({ reference, apiUrl, pago }) => {
  const [detalle, setDetalle] = useState(pago || null);
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(!pago);

  useEffect(() => {
    if (pago) return; // Ya tenemos los datos desde EstadoPago

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
  }, [reference, apiUrl, pago]);

  if (cargando) return <div className="spinner" />;
  if (error || !detalle)
    return <p style={{ color: "crimson" }}>🚨 No se pudo cargar el resumen del pago.</p>;

  return (
    <div className="resumen-pago" style={{ marginTop: "2rem", textAlign: "left" }}>
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

      {Array.isArray(detalle.productos) && detalle.productos.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4>🛍️ Productos comprados</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Producto</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>Precio</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {detalle.productos.map((p, index) => (
                <tr key={index}>
                  <td>{p.nombre}</td>
                  <td style={{ textAlign: "right" }}>
                    $ {p.precio.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: "right" }}>{p.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResumenPago;
