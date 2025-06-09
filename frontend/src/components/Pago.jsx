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

  // 📌 🔥 Obtener lista de bancos desde el backend 🔥
  useEffect(() => {
    axios.get("http://localhost:3000/bancos")
      .then(res => {
        console.log("✅ Bancos recibidos:", res.data); 
        if (res.data && Array.isArray(res.data)) {  
          setBancos(res.data); 
        } else {
          console.error("❌ Formato incorrecto en la respuesta del backend.");
          setBancos([]);
        }
      })
      .catch(err => {
        console.error("❌ Error obteniendo bancos:", err);
        setBancos([]);
      });
  }, []);

  // 📌 🔥 Función para calcular el total del carrito 🔥
  const calcularTotal = () => {
    if (!carrito || carrito.length === 0) {
      console.warn("❌ El carrito está vacío.");
      return 0;
    }
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  };

  // 📌 🔥 Ajuste en `useEffect` para evitar cálculos innecesarios si `carrito` está vacío 🔥
  useEffect(() => {
    setTotal(calcularTotal());
  }, [carrito]);

  // 📌 🔥 Validación de correo electrónico 🔥
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 📌 🔥 Función para procesar el pago con PSE 🔥
  const pagarConPSE = async () => {
    setError(""); 
    setLoading(true); 
    console.log("🚀 Procesando pago con datos:", { usuario: email, nombre, valor: total, document, documentType, bankCode });

    if (!email || !validarEmail(email)) {
      setError("❌ Ingresa un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (!nombre || !document || !documentType || !bankCode) {
      setError("❌ Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    if (total === 0) {
      setError("❌ No puedes pagar un carrito vacío.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/pago/pse", { 
        usuario: email, 
        nombre,  
        valor: total, 
        document, 
        document_type: documentType, 
        financial_institution_code: bankCode 
      });

      alert("✅ Pago iniciado, sigue las instrucciones en PSE.");
      console.log("🎯 Respuesta de pago:", response.data);
    } catch (err) {
      setError("❌ Hubo un problema al procesar el pago. Intenta nuevamente.");
      console.error("❌ Error al procesar el pago:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>💳 Pagar con PSE</h2>

      {/* 📌 Campos requeridos para el pago */}
      <input type="text" placeholder="Nombre completo" onChange={(e) => setNombre(e.target.value)} value={nombre} required />
      <input type="email" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} value={email} required />
      <input type="text" placeholder="Número de documento" onChange={(e) => setDocument(e.target.value)} value={document} required />
      
      <select onChange={(e) => setDocumentType(e.target.value)} value={documentType}>
        <option value="CC">Cédula</option>
        <option value="CE">Cédula Extranjera</option>
        <option value="NIT">NIT</option>
      </select>
      
      {/* 📌 🔥 Dropdown dinámico con nombres de bancos 🔥 */}
      <select onChange={(e) => setBankCode(e.target.value)} value={bankCode}>
        <option value="">Selecciona tu banco</option>
        {bancos.length > 0 ? bancos.map((banco) => (
          <option key={banco.codigo} value={banco.codigo}>{banco.nombre}</option>
        )) : <option disabled>No se encontraron bancos.</option>}
      </select>

      {/* 🔥 Mostramos el total calculado antes de pagar 🔥 */}
      <h3>Total a pagar: ${total.toFixed(2)} COP</h3>

      {/* 🔥 Mensaje de error */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {/* 🔥 Botón para pagar con PSE 🔥 */}
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
