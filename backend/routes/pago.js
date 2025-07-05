const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();

// 📦 Modelo de pagos en MongoDB
const Pago = require("../models/Pago");

// 🌐 URL base de Wompi según entorno
const WOMPI_BASE_URL = process.env.WOMPI_ENV === "sandbox"
  ? "https://sandbox.wompi.co/v1"
  : "https://production.wompi.co/v1";

const WOMPI_PUBLIC_KEY = process.env.PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!WOMPI_PUBLIC_KEY || !WOMPI_PRIVATE_KEY) {
  console.error("❌ ERROR: Llaves de Wompi no definidas correctamente en .env");
  process.exit(1);
}

console.log("🔑 Llave pública:", WOMPI_PUBLIC_KEY ? "✅ Ok" : "❌ No definida");
console.log("🔑 Llave privada:", WOMPI_PRIVATE_KEY ? "✅ Ok" : "❌ No definida");
console.log("🔗 Endpoint Wompi:", WOMPI_BASE_URL);

// 🧪 Función para obtener token de aceptación
const obtenerTokenAceptacion = async () => {
  try {
    const response = await axios.get(`${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`);
    const tokenAceptacion = response.data?.data?.presigned_acceptance?.acceptance_token;
    if (!tokenAceptacion) throw new Error("❌ Token inválido");
    return tokenAceptacion;
  } catch (error) {
    console.error("❌ Error al obtener el token de aceptación:", error.response?.data || error.message);
    return null;
  }
};

// 📧 Validación de correo
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 💳 POST /pse → crear transacción
router.post("/pse", async (req, res) => {
  console.log("📩 Se recibió POST en /pago/pse");
  console.log("🔎 Cuerpo recibido:", req.body);

  try {
    const { usuario, valor, document, document_type, financial_institution_code, nombre } = req.body;

    // 🛑 Validaciones
    if (valor < 1500) {
      return res.status(400).json({ error: "Monto mínimo $1.500 COP." });
    }
    if (!usuario || !validarEmail(usuario) || !document || !document_type || !financial_institution_code || !nombre) {
      return res.status(400).json({ error: "❌ Faltan campos o son inválidos." });
    }
    if (process.env.WOMPI_ENV === "sandbox" && !["1", "2"].includes(financial_institution_code)) {
      return res.status(400).json({ error: "Código de banco inválido para Sandbox (usa 1 o 2)." });
    }

    const tokenAceptacion = await obtenerTokenAceptacion();
    if (!tokenAceptacion) return res.status(500).json({ error: "❌ No se obtuvo token de aceptación." });

    // 🧾 Construcción de la transacción
    const referencia = `PAGO_${Date.now()}`;
    const redirectURL = `http://localhost:5000/estado/${referencia}`;

    const pagoData = {
      acceptance_token: tokenAceptacion,
      amount_in_cents: parseInt(valor * 100, 10),
      currency: "COP",
      customer_email: usuario,
      reference: referencia,
      redirect_url: redirectURL,
      payment_method: {
        type: "PSE",
        user_type: 0,
        user_legal_id: String(document),
        user_legal_id_type: document_type,
        financial_institution_code: String(financial_institution_code),
        payment_description: "Pago a Tienda Wompi"
      }
    };

    const firma = crypto.createHash("sha256")
      .update(`${pagoData.reference}${pagoData.amount_in_cents}${pagoData.currency}${process.env.INTEGRITY_SECRET}`)
      .digest("hex");
    pagoData.signature = firma;

    console.log("📤 Enviando transacción a Wompi:", pagoData);

    const respuesta = await axios.post(`${WOMPI_BASE_URL}/transactions`, pagoData, {
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Respuesta de Wompi:", respuesta.data);

    // 💾 Guardar en base de datos
    try {
      const pagoGuardado = await Pago.create({
        reference: referencia,
        status: respuesta.data.data.status || "PENDING",
        amount_in_cents: pagoData.amount_in_cents,
        customer_email: pagoData.customer_email
      });
      console.log("💾 Transacción guardada en MongoDB:", pagoGuardado);
    } catch (err) {
      console.error("❌ Error al guardar en Mongo:", err);
    }

    res.status(200).json({
      mensaje: "✅ Pago iniciado",
      reference: referencia,
      redirect_url: respuesta.data.data.redirect_url
    });

  } catch (error) {
    console.error("❌ Error general en POST /pse:", JSON.stringify(error.response?.data || error.message));
    res.status(500).json({ error: "Error procesando el pago con PSE" });
  }
});

// 🏦 Lista de bancos (sandbox)
router.get("/bancos", (req, res) => {
  res.json([
    { nombre: "Banco que aprueba (Sandbox PSE)", codigo: "1" },
    { nombre: "Banco que rechaza (Sandbox PSE)", codigo: "2" }
  ]);
});

// 🔍 Consulta de estado por referencia
router.get("/:reference", async (req, res) => {
  const { reference } = req.params;
  try {
    const pago = await Pago.findOne({ reference });
    if (!pago) return res.status(404).json({ error: "⚠️ Referencia no encontrada." });
    res.status(200).json({ status: pago.status });
  } catch (error) {
    console.error("❌ Error en GET /:reference:", error);
    res.status(500).json({ error: "Error interno al consultar estado." });
  }
});

// 🧾 Últimos registros (debug)
router.get("/ultimos-pagos", async (req, res) => {
  try {
    const ultimos = await Pago.find().sort({ created_at: -1 }).limit(5);
    res.json(ultimos.map(p => ({
      reference: p.reference,
      status: p.status,
      email: p.customer_email
    })));
  } catch (error) {
    console.error("❌ Error en GET /ultimos-pagos:", error);
    res.status(500).json({ error: "Error al consultar pagos recientes." });
  }
});

module.exports = router;
