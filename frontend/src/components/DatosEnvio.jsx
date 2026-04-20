import React, { useState } from "react";
import axios from "axios";

const DatosEnvio = ({ idPago, nombre, telefono, ciudad, apiUrl }) => {
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const campoEstilo = {
    display: "block",
    width: "100%",
    maxWidth: "400px",
    margin: "8px auto",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  };

  const etiqueta = (emoji, texto) => (
    <label
      style={{
        display: "block",
        textAlign: "left",
        maxWidth: "400px",
        margin: "0 auto",
        fontWeight: "bold"
      }}
    >
      {emoji} {texto}
    </label>
  );

  const guardarEnvio = async () => {
    setError("");
    setMensaje("");

    if (!idPago) {
      setError("❌ No hay referencia de pago válida.");
      return;
    }

    if (!direccion || direccion.length < 5) {
      setError("❌ Ingresa una dirección válida.");
      return;
    }

    try {
      const payload = {
        id_pago: idPago,
        nombre_destinatario: nombre,
        telefono_destinatario: telefono,
        ciudad,
        direccion
      };

      await axios.post(`${apiUrl}/envios/crear-envio`, payload);
      setMensaje("✅ Datos de envío guardados correctamente.");
    } catch (err) {
      setError("❌ Error al guardar el envío. Intenta nuevamente.");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        borderTop: "1px solid #eee",
        marginTop: "2rem"
      }}
    >
      <h3>📦 Datos de envío</h3>

      {etiqueta("🏠", "Dirección de entrega")}
      <input
        type="text"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Ej: Calle 123 #45-67"
        style={campoEstilo}
      />

      <button
        onClick={guardarEnvio}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "12px"
        }}
      >
        📬 Guardar envío
      </button>

      {mensaje && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "1rem" }}>
          {mensaje}
        </p>
      )}
      {error && (
        <p style={{ color: "red", fontWeight: "bold", marginTop: "1rem" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DatosEnvio;