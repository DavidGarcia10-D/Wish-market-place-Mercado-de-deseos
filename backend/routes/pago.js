const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

// 📌 🔥 Definir URL según el ambiente de ejecución
const WOMPI_BASE_URL = process.env.WOMPI_ENV === "sandbox"
  ? "https://sandbox.wompi.co/v1"
  : "https://production.wompi.co/v1"; 

// 📌 🔥 Validación de claves de Wompi
const WOMPI_PUBLIC_KEY = process.env.PUBLIC_KEY; 
const WOMPI_PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!WOMPI_PUBLIC_KEY || !WOMPI_PRIVATE_KEY) {
  console.error("❌ ERROR: Llaves de Wompi no definidas correctamente en .env");
  process.exit(1);
}

console.log("🔑 Llave privada:", WOMPI_PRIVATE_KEY ? "✅ Cargada correctamente" : "❌ NO definida");
console.log("🔑 Llave pública:", WOMPI_PUBLIC_KEY ? "✅ Cargada correctamente" : "❌ NO definida");
console.log("🔗 URL de Wompi usada:", WOMPI_BASE_URL);

// 📌 🔥 Lista de bancos con nombres y códigos 🔥
const bancosValidos = [
  { nombre: "Bancolombia", codigo: "007" },
  { nombre: "Banco de Bogotá", codigo: "001" },
  { nombre: "Davivienda", codigo: "051" },
  { nombre: "Banco Popular", codigo: "002" },
  { nombre: "Banco Caja Social", codigo: "032" },
  { nombre: "BBVA", codigo: "013" },
  { nombre: "Banco de Occidente", codigo: "023" },
  { nombre: "Citibank", codigo: "009" },
  { nombre: "Scotiabank Colpatria", codigo: "019" },
  { nombre: "Nequi", codigo: "507" },
  { nombre: "Daviplata", codigo: "551" }
];

// 📌 🔥 Obtener el token de aceptación dinámico 🔥
const obtenerTokenAceptacion = async () => {
  try {
    console.log("🔹 Obteniendo token de aceptación con llave pública:", WOMPI_PUBLIC_KEY);

    const response = await axios.get(`${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`);
    
    const tokenAceptacion = response.data?.data?.presigned_acceptance?.acceptance_token;
    if (!tokenAceptacion) throw new Error("❌ No se recibió un token de aceptación válido.");

    console.log("✅ Token de aceptación obtenido correctamente.");
    return tokenAceptacion;

  } catch (error) {
    console.error("❌ Error al obtener el token de aceptación:", error.response ? error.response.data : error.message);
    return null;
  }
};

// 📌 🔥 Validación de correo electrónico 🔥
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 📌 🔥 Ruta para procesar pagos con PSE 🔥
router.post("/pse", async (req, res) => {
  try {
    console.log("📌 Datos recibidos:", req.body);

    const { usuario, valor, document, document_type, financial_institution_code, nombre } = req.body;
    if (!usuario || !validarEmail(usuario) || !valor || !document || !document_type || !financial_institution_code || !nombre) {
      return res.status(400).json({ error: "❌ Datos faltantes o inválidos en la solicitud." });
    }

    const bancoValido = bancosValidos.find(b => b.codigo === financial_institution_code);
    if (!bancoValido) {
      return res.status(400).json({ error: "❌ Código de institución financiera no válido. Usa un código permitido." });
    }

    console.log("🔹 Iniciando pago con PSE para:", usuario, "Monto:", valor);

    // 📌 🔥 Obtención del token de aceptación
    const tokenAceptacion = await obtenerTokenAceptacion();
    if (!tokenAceptacion) return res.status(500).json({ error: "❌ No se pudo obtener el token de aceptación." });

    // 📌 🔥 Corrección de `payment_method` según Wompi
    const pagoData = {
      acceptance_token: tokenAceptacion,
      amount_in_cents: valor * 100, 
      currency: "COP",
      customer_email: usuario,
      payment_method: {
        type: "PSE",
        user_type: "natural",
        financial_institution_code,
        payer_person: { 
          document,
          document_type,
          name: nombre,  
          email: usuario
        }
      },
      reference: `PAGO_${Date.now()}`
    };

    console.log("📌 Datos que se enviarán a Wompi:", JSON.stringify(pagoData, null, 2));

    // 📌 🔥 Agregamos autenticación en la solicitud
    const respuesta = await axios.post(`${WOMPI_BASE_URL}/transactions`, pagoData, {
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Respuesta exitosa de Wompi:", respuesta.data);
    res.json(respuesta.data);

  } catch (error) {
    console.error("❌ Error en el pago con PSE:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error procesando pago con PSE" });
  }
});

// 📌 🔥 Ruta para obtener lista de bancos 🔥
router.get("/bancos", (req, res) => {
  res.json({ bancos: bancosValidos });
});

module.exports = router;
