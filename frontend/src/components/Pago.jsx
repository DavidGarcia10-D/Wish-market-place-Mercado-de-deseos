import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";
import DatosEnvio from "./DatosEnvio";
import { showError } from "../utils/toast";
import { ciudadesColombia } from "../data/ciudades";

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

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("datosPago"));
    if (datosGuardados) {
      setNombre(datosGuardados.nombre || "");
      setEmail(datosGuardados.email || "");
      setPhone(datosGuardados.phone || "");
      setCiudad(datosGuardados.ciudad || "");
      setDocument(datosGuardados.document || "");
      setDocumentType(datosGuardados.documentType || "CC");
      setUserType(datosGuardados.userType ?? 0);
    }
  }, []);

  useEffect(() => {
    const datos = {
      nombre,
      email,
      phone,
      ciudad,
      document,
      documentType,
      userType,
    };
    localStorage.setItem("datosPago", JSON.stringify(datos));
  }, [nombre, email, phone, ciudad, document, documentType, userType]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/pago/bancos-wompi`)
      .then((res) => {
        if (Array.isArray(res.data)) setBancos(res.data);
      })
      .catch(() => {
        setBancos([]);
        showError("❌ No se pudo cargar la lista de bancos.");
      });
  }, [apiUrl]);

  useEffect(() => {
    const totalCalculado = carrito.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );
    setTotal(totalCalculado);
  }, [carrito]);

  const validarEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarTelefono = (tel) => /^3\d{9}$/.test(tel);

  const formatCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor) + " COP";

  const capitalizar = (texto) =>
    texto
      .trim()
      .split(" ")
      .filter(Boolean)
      .map(
        (palabra) =>
          palabra.charAt(0).toUpperCase() +
          palabra.slice(1).toLowerCase()
      )
      .join(" ");

  const pagarConPSE = async () => {
    if (
      !nombre ||
      !document ||
      !documentType ||
      !bankCode ||
      !phone ||
      !ciudad ||
      !email
    ) {
      showError("❌ Completa todos los campos.");
      return;
    }

    if (!validarEmail(email)) {
      showError("❌ Correo inválido.");
      return;
    }

    if (!validarTelefono(phone)) {
      showError("❌ Teléfono inválido.");
      return;
    }

    if (![0, 1].includes(userType)) {
      showError("❌ Selecciona tipo de usuario.");
      return;
    }

    const ciudadNormalizada = ciudad
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const ciudadesNormalizadas = ciudadesColombia.map((c) =>
      c
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
    );

    if (!ciudadesNormalizadas.includes(ciudadNormalizada)) {
      showError("❌ Selecciona una ciudad válida de la lista.");
      return;
    }

    if (total < 1500) {
      showError("❌ Monto mínimo: $1.500 COP.");
      return;
    }

    setMensaje("⏳ Preparando redirección segura...");
    setLoading(true);

    try {
      const bancoSeleccionado = bancos.find(
        (b) => b.financial_institution_code === bankCode
      );

      const payload = {
        valor: Number(total),
        usuario: email,
        document,
        document_type: documentType,
        financial_institution_code: bankCode,
        nombre_cliente: capitalizar(nombre),
        banco_nombre:
          bancoSeleccionado?.financial_institution_name || "Desconocido",
        telefono_cliente: phone,
        user_type: userType,
        carrito: carrito.map((p) => ({
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad,
        })),
      };

      const response = await axios.post(`${apiUrl}/pago/pse`, payload);
      const { success, url_pago, id_pago } = response.data;

      if (!success || !url_pago)
        throw new Error("URL de pago inválida.");

      setIdPago(id_pago);
      setMensaje("✅ Redirigiendo a Wompi...");
      window.location.href = url_pago;
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";
      const wompiMsg = err.response?.data?.wompi_error || "";
      showError(`❌ Error: ${backendMsg || wompiMsg || err.message}`);
      setMensaje("");
      setLoading(false);
    }
  };

  const campoEstilo = {
    display: "block",
    width: "100%",
    maxWidth: "400px",
    margin: "8px auto",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const etiqueta = (emoji, texto) => (
    <label
      style={{
        display: "block",
        textAlign: "left",
        maxWidth: "400px",
        margin: "0 auto",
        fontWeight: "bold",
      }}
    >
      {emoji} {texto}
    </label>
  );

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>💳 Pagar con PSE</h2>

      {etiqueta("👤", "Nombre completo")}
      <input
        type="text"
        value={nombre}
        onChange={(e) => {
          const limpio = e.target.value.replace(
            /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,
            ""
          );
          setNombre(limpio);
        }}
        onBlur={() => setNombre(capitalizar(nombre))}
        style={campoEstilo}
      />

      {etiqueta("📧", "Correo electrónico")}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        style={campoEstilo}
      />

      {etiqueta("📱", "Teléfono")}
      <input
        type="tel"
        value={phone}
        maxLength={10}
        onChange={(e) => {
          const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
          setPhone(soloNumeros.trim());
        }}
        style={campoEstilo}
      />

      {etiqueta("📄", "Tipo de documento")}
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        style={campoEstilo}
      >
        <option value="CC">Cédula</option>
        <option value="CE">Cédula Extranjera</option>
        <option value="TI">Tarjeta de Identidad</option>
        <option value="NIT">NIT</option>
      </select>

      {etiqueta("🪪", "Número de documento")}
      <input
        type="text"
        value={document}
        maxLength={20}
        onChange={(e) => {
          const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
          setDocument(soloNumeros.trim());
        }}
        style={campoEstilo}
      />

      {etiqueta("🌆", "Ciudad")}
      <input
        list="ciudades"
        value={ciudad}
        onChange={(e) => {
          const limpio = e.target.value.replace(
            /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,
            ""
          );
          setCiudad(limpio);
        }}
        style={campoEstilo}
      />
      <datalist id="ciudades">
        {ciudadesColombia.map((c, i) => (
          <option key={i} value={c} />
        ))}
      </datalist>

      {etiqueta("🧑‍💼", "Tipo de usuario")}
      <select
        value={userType}
        onChange={(e) => setUserType(Number(e.target.value))}
        style={campoEstilo}
      >
        <option value={0}>Persona Natural</option>
        <option value={1}>Persona Jurídica</option>
      </select>

      {etiqueta("🏦", "Banco")}
      <select
        value={bankCode}
        onChange={(e) => setBankCode(e.target.value)}
        style={campoEstilo}
      >
        <option value="">Selecciona tu banco</option>
        {bancos.map((banco, index) => (
          <option
            key={`${banco.financial_institution_code}-${index}`}
            value={banco.financial_institution_code}
          >
            {banco.financial_institution_name}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: "20px" }}>
        🧾 Total a pagar: {formatCOP(total)}
      </h3>

      {mensaje && (
        <p style={{ color: loading ? "#555" : "green", fontWeight: "bold" }}>
          {mensaje}
        </p>
      )}

      <button
        onClick={pagarConPSE}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ccc" : "#4CAF50",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "20px",
        }}
      >
        {loading ? "⏳ Procesando..." : "💰 Pagar ahora"}
      </button>

      {idPago && (
        <div style={{ marginTop: "3rem" }}>
          <DatosEnvio
            idPago={idPago}
            nombre={capitalizar(nombre)}
            telefono={phone}
            ciudad={capitalizar(ciudad)}
          />
        </div>
      )}
    </div>
  );
};

export default Pago;
