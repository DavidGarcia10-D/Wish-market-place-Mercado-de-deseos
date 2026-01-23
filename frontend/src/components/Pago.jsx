import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";
import DatosEnvio from "./DatosEnvio";
import { showSuccess, showError } from "../utils/toast";
import { getPagoEstilos } from "../estilos/pagoEstilos";

const Pago = ({ apiUrl }) => {
  const { carrito } = useContext(CarritoContext);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [document, setDocument] = useState("");
  const [documentType, setDocumentType] = useState("CC");
  const [bankCode, setBankCode] = useState("");
  const [userType, setUserType] = useState(0);
  const [phone, setPhone] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [bancos, setBancos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [idPago, setIdPago] = useState(null);
  const estilos = getPagoEstilos(loading);

  useEffect(() => {
    axios.get(`${apiUrl}/pago/bancos-wompi`)
      .then(res => {
        if (Array.isArray(res.data)) setBancos(res.data);
      })
      .catch(() => {
        setBancos([]);
        showError("❌ No se pudo cargar la lista de bancos.");
      });
  }, [apiUrl]);

  useEffect(() => {
    const totalCalculado = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    setTotal(totalCalculado);
  }, [carrito]);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefono = (tel) => /^3\d{9}$/.test(tel);

  const formatCOP = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(valor) + " COP";
  };

  const pagarConPSE = async () => {
    setMensaje("⏳ Preparando redirección segura...");
    setLoading(true);

    if (!email || !validarEmail(email)) {
      showError("❌ Correo inválido.");
      setLoading(false); return;
    }

    if (!nombre || !document || !documentType || !bankCode || !phone || !ciudad) {
      showError("❌ Completa todos los campos.");
      setLoading(false); return;
    }

    if (!validarTelefono(phone)) {
      showError("❌ Teléfono inválido.");
      setLoading(false); return;
    }

    if (![0, 1].includes(userType)) {
      showError("❌ Selecciona tipo de usuario.");
      setLoading(false); return;
    }

    if (total < 1500) {
      showError("❌ Monto mínimo: $1.500 COP.");
      setLoading(false); return;
    }

    try {
      const bancoSeleccionado = bancos.find(b => b.financial_institution_code === bankCode);

      const payload = {
        valor: Number(total),
        usuario: email,
        document,
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
      const { success, url_pago, id_pago } = response.data;

      if (!success || !url_pago) throw new Error("URL de pago inválida.");

      setIdPago(id_pago);
      setMensaje("✅ Redirigiendo a Wompi...");
      window.location.href = url_pago;

    } catch (err) {
      const backendMsg = err.response?.data?.message || err.response?.data?.error || "";
      const wompiMsg = err.response?.data?.wompi_error || "";
      showError(`❌ Error: ${backendMsg || wompiMsg || err.message}`);
      setMensaje("");
    } finally {
      setLoading(false);
    }
  };

  const etiqueta = (emoji, texto) => (
    <label className="label-pago">
      {emoji} {texto}
    </label>
  );

  return (
    <div className="formulario-pago" style={{ padding: "2rem", textAlign: "center" }}>
      <h2>💳 Pagar con PSE</h2>

      {etiqueta("👤", "Nombre completo")}
      <input
        className="campo-pago"
        type="text"
        value={nombre}
        onChange={(e) => {
          const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
          setNombre(soloLetras);
        }}
        placeholder="Tu nombre completo"
      />

      {etiqueta("📧", "Correo electrónico")}
      <input
        className="campo-pago"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@ejemplo.com"
      />

      {etiqueta("📱", "Teléfono")}
      <input
        className="campo-pago"
        type="tel"
        value={phone}
        maxLength={10}
        onChange={(e) => {
          const soloNumeros = e.target.value.replace(/[^0-9]/g, '');
          setPhone(soloNumeros);
        }}
        placeholder="3XXXXXXXXX"
      />

      {etiqueta("📄", "Tipo de documento")}
      <select
        className="campo-pago"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
      >
        <option value="CC">Cédula</option>
        <option value="CE">Cédula Extranjera</option>
        <option value="TI">Tarjeta de Identidad</option>
        <option value="NIT">NIT</option>
      </select>

      {etiqueta("🪪", "Número de documento")}
      <input
        className="campo-pago"
        type="text"
        value={document}
        maxLength={20}
        onChange={(e) => {
          const soloNumeros = e.target.value.replace(/[^0-9]/g, '');
          setDocument(soloNumeros);
        }}
        placeholder="Número de documento"
      />

      {etiqueta("🌆", "Ciudad")}
      <input
        className="campo-pago"
        type="text"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        placeholder="Ciudad"
      />

      {etiqueta("🧑‍💼", "Tipo de usuario")}
      <select
        className="campo-pago"
        value={userType}
        onChange={(e) => setUserType(Number(e.target.value))}
      >
        <option value={0}>Persona Natural</option>
        <option value={1}>Persona Jurídica</option>
      </select>

      {etiqueta("🏦", "Banco")}
      <select
        className="campo-pago"
        value={bankCode}
        onChange={(e) => setBankCode(e.target.value)}
      >
        <option value="">Selecciona tu banco</option>
        {bancos.map((banco, index) => (
          <option key={`${banco.financial_institution_code}-${index}`} value={banco.financial_institution_code}>
            {banco.financial_institution_name}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: "20px" }}>🧾 Total a pagar: {formatCOP(total)}</h3>

      {mensaje && <p style={{ color: loading ? "#555" : "green", fontWeight: "bold" }}>{mensaje}</p>}

      <button
        className="boton-pagar"
        onClick={pagarConPSE}
        disabled={loading}
      >
        {loading ? "⏳ Procesando..." : "💰 Pagar ahora"}
      </button>

      {idPago && (
        <div style={{ marginTop: "3rem" }}>
          <DatosEnvio
            idPago={idPago}
            nombre={nombre}
            telefono={phone}
            ciudad={ciudad}
          />
        </div>
      )}
    </div>
  );
};

export default Pago;