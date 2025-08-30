import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";

const Pago = ({ apiUrl }) => {
  const { carrito } = useContext(CarritoContext);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [document, setDocument] = useState("");
  const [documentType, setDocumentType] = useState("CC");
  const [bankCode, setBankCode] = useState("");
  const [userType, setUserType] = useState(1); // 1 = Natural, 2 = Jurídica
  const [bancos, setBancos] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios.get(`${apiUrl}/bancos`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setBancos([
            { nombre: "Banco que aprueba (Sandbox)", codigo: "1" },
            { nombre: "Banco que rechaza (Sandbox)", codigo: "2" },
            ...res.data
          ]);
        }
      })
      .catch(() => setBancos([]));
  }, [apiUrl]);

  useEffect(() => {
    const totalCalculado = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    setTotal(totalCalculado);
  }, [carrito]);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const pagarConPSE = async () => {
    setError("");
    setMensaje("");
    setLoading(true);

    if (!email || !validarEmail(email)) {
      setError("❌ Ingresa un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (!nombre || !document || !documentType || !bankCode) {
      setError("❌ Completa todos los campos correctamente.");
      setLoading(false);
      return;
    }

    if (![1, 2].includes(userType)) {
      setError("❌ Selecciona si eres persona natural o jurídica.");
      setLoading(false);
      return;
    }

    if (total < 1500) {
      setError("❌ Monto mínimo permitido: $1.500 COP.");
      setLoading(false);
      return;
    }

    try {
      const bancoSeleccionado = bancos.find(b => b.codigo === bankCode);

      const payload = {
        usuario: email,
        nombre_cliente: nombre,
        banco_nombre: bancoSeleccionado?.nombre || "Desconocido",
        valor: total,
        document,
        document_type: documentType,
        financial_institution_code: String(bankCode),
        user_type: userType,
        carrito: carrito.map(p => ({
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad
        }))
      };

      const response = await axios.post(`${apiUrl}/pago/pse`, payload);
      console.log("📥 Respuesta del backend:", response.data);

      const { success, url_pago } = response.data;

      if (!success || !url_pago) {
        throw new Error("No se recibió URL de pago válida.");
      }

      setMensaje("✅ Redirigiéndote a Wompi para completar el pago...");
      window.location.href = url_pago;

    } catch (err) {
      console.error("❌ Error al procesar el pago:", err);
      setError(`❌ No se pudo procesar el pago. ${err.message || "Intenta nuevamente."}`);
    } finally {
      setLoading(false);
    }
  };

  const campoEstilo = {
    display: "block",
    width: "100%",
    maxWidth: "400px",
    margin: "12px auto",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>💳 Pagar con PSE</h2>

      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={campoEstilo}
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={campoEstilo}
      />

      <input
        type="text"
        placeholder="Número de documento"
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        style={campoEstilo}
      />

      <select value={userType} onChange={(e) => setUserType(Number(e.target.value))} style={campoEstilo}>
        <option value={1}>Persona Natural</option>
        <option value={2}>Persona Jurídica</option>
      </select>

      <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} style={campoEstilo}>
        <option value="CC">Cédula</option>
        <option value="CE">Cédula Extranjera</option>
        <option value="TI">Tarjeta de Identidad</option>
        <option value="NIT">NIT</option>
      </select>

      <select value={bankCode} onChange={(e) => setBankCode(e.target.value)} style={campoEstilo}>
        <option value="">Selecciona tu banco</option>
        {bancos.map((banco, index) => (
          <option key={`${banco.codigo}-${index}`} value={banco.codigo}>
            {banco.nombre}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: "20px" }}>
        Total a pagar: ${total.toFixed(2)} COP
      </h3>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {mensaje && <p style={{ color: "green", fontWeight: "bold" }}>{mensaje}</p>}

      <button
        onClick={pagarConPSE}
        style={{
          backgroundColor: loading ? "#ccc" : "#4CAF50",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "20px"
        }}
        disabled={loading}
      >
        {loading ? "⏳ Procesando..." : "💰 Pagar ahora"}
      </button>
    </div>
  );
};

export default Pago;
