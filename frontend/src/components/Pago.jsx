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
  const [userType, setUserType] = useState(0);
  const [phone, setPhone] = useState("");
  const [bancos, setBancos] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios.get(`${apiUrl}/pago/bancos-wompi`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setBancos(res.data);
        }
      })
      .catch(() => {
        setBancos([]);
        setError("❌ No se pudo cargar la lista de bancos. Intenta más tarde.");
      });
  }, [apiUrl]);

  useEffect(() => {
    const totalCalculado = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    setTotal(totalCalculado);
  }, [carrito]);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefono = (tel) => /^3\d{9}$/.test(tel);

  const pagarConPSE = async () => {
    setError("");
    setMensaje("⏳ Estamos preparando tu redirección segura al banco...");
    setLoading(true);

    if (!email || !validarEmail(email)) {
      setError("❌ Ingresa un correo electrónico válido.");
      setLoading(false);
      setMensaje("");
      return;
    }

    if (!nombre || !document || !documentType || !bankCode || !phone) {
      setError("❌ Completa todos los campos correctamente.");
      setLoading(false);
      setMensaje("");
      return;
    }

    if (!validarTelefono(phone)) {
      setError("❌ Ingresa un número de teléfono válido (10 dígitos, inicia con 3).");
      setLoading(false);
      setMensaje("");
      return;
    }

    if (![0, 1].includes(userType)) {
      setError("❌ Selecciona si eres persona natural o jurídica.");
      setLoading(false);
      setMensaje("");
      return;
    }

    if (total < 1500) {
      setError("❌ Monto mínimo permitido: $1.500 COP.");
      setLoading(false);
      setMensaje("");
      return;
    }

    try {
      const bancoSeleccionado = bancos.find(b => b.financial_institution_code === bankCode);

      const payload = {
        valor: Number(total),
        usuario: email,
        document: document,
        document_type: documentType,
        financial_institution_code: bankCode,
        nombre_cliente: nombre,
        banco_nombre: bancoSeleccionado?.financial_institution_name || "Desconocido",
        telefono_cliente: phone,
        user_type: userType,
        carrito: carrito.map(p => ({
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad
        }))
      };

      const response = await axios.post(`${apiUrl}/pago/pse`, payload);
      const { success, url_pago } = response.data;

      if (!success || !url_pago) {
        throw new Error("No se recibió URL de pago válida.");
      }

      setMensaje("✅ Redirigiéndote a Wompi para completar el pago...");
      window.location.href = url_pago;

    } catch (err) {
      const backendMsg = err.response?.data?.message || err.response?.data?.error || "";
      const wompiMsg = err.response?.data?.wompi_error || "";
      setError(`❌ No se pudo procesar el pago. ${backendMsg || wompiMsg || err.message || "Intenta nuevamente."}`);
      setMensaje("");
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
        type="tel"
        placeholder="Número de teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
        <option value={0}>Persona Natural</option>
        <option value={1}>Persona Jurídica</option>
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
          <option key={`${banco.financial_institution_code}-${index}`} value={banco.financial_institution_code}>
            {banco.financial_institution_name}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: "20px" }}>
        Total a pagar: ${total.toFixed(2)} COP
      </h3>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {mensaje && <p style={{ color: loading ? "#555" : "green", fontWeight: "bold" }}>{mensaje}</p>}

      {loading && (
        <div style={{ marginTop: "20px" }}>
          <p>🔄 Procesando tu transacción con Wompi...</p>
        </div>
      )}

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
