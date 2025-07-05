import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";

const Pago = () => {
  const { carrito } = useContext(CarritoContext);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [total, setTotal] = useState(0);
  const [document, setDocument] = useState("");
  const [documentType, setDocumentType] = useState("CC");
  const [bankCode, setBankCode] = useState("");
  const [bancos, setBancos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(""); // ✅ Visualiza estado de redirección

  // 🔍 Obtener bancos desde el backend
  useEffect(() => {
    axios.get("http://localhost:3000/bancos")
      .then(res => {
        if (Array.isArray(res.data)) {
          setBancos([
            { nombre: "Banco que aprueba (Sandbox PSE)", codigo: "1" },
            { nombre: "Banco que rechaza (Sandbox PSE)", codigo: "2" },
            ...res.data
          ]);
        }
      })
      .catch(err => {
        console.error("❌ Error al obtener bancos:", err);
        setBancos([]);
      });
  }, []);

  // 💰 Calcular total del carrito
  useEffect(() => {
    if (carrito?.length > 0) {
      setTotal(carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0));
    }
  }, [carrito]);

  // 📧 Validar email
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 💳 Iniciar flujo de pago PSE
  const pagarConPSE = async () => {
    setError("");
    setMensaje("");
    setLoading(true);

    if (!email || !validarEmail(email)) {
      setError("❌ Ingresa un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (!nombre || !document || !documentType || !["1", "2"].includes(bankCode)) {
      setError("❌ Selecciona todos los campos correctamente.");
      setLoading(false);
      return;
    }

    if (total === 0) {
      setError("❌ Tu carrito está vacío.");
      setLoading(false);
      return;
    }

    try {
      // 📤 Enviar datos al backend para generar la transacción
      const response = await axios.post("http://localhost:3000/pago/pse", {
        usuario: email,
        nombre,
        valor: total,
        document,
        document_type: documentType,
        financial_institution_code: String(bankCode)
      });

      const { reference, redirect_url } = response.data;

      if (!redirect_url) {
        throw new Error("⚠️ No se recibió una URL de redirección desde el backend.");
      }

      console.log("🔁 Redirigiendo a Wompi:", redirect_url);
      setMensaje("✅ Redirigiéndote a Wompi...");

      // 🌐 Redirigir al usuario a la pasarela de Wompi
      window.location.href = redirect_url;

    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      setError("❌ No se pudo procesar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>💳 Pagar con PSE</h2>

      <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Número de documento" value={document} onChange={(e) => setDocument(e.target.value)} />

      <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
        <option value="CC">Cédula</option>
        <option value="CE">Cédula Extranjera</option>
        <option value="NIT">NIT</option>
      </select>

      <select value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
        <option value="">Selecciona tu banco</option>
        {bancos.map((banco, index) => (
          <option key={`${banco.codigo}-${index}`} value={banco.codigo}>
            {banco.nombre}
          </option>
        ))}
      </select>

      <h3>Total a pagar: ${total.toFixed(2)} COP</h3>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {mensaje && <p style={{ color: "green", fontWeight: "bold" }}>{mensaje}</p>}

      <button
        onClick={pagarConPSE}
        style={{
          backgroundColor: loading ? "#ccc" : "#4CAF50",
          color: "white",
          padding: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer"
        }}
        disabled={loading}
      >
        {loading ? "⏳ Procesando..." : "💰 Pagar ahora"}
      </button>
    </div>
  );
};

export default Pago;
