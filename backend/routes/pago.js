const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();

const Pago = require("../models/Pago");

// 🔧 Determina entorno actual (sandbox o producción)
const WOMPI_BASE_URL = process.env.WOMPI_ENV === "sandbox"
  ? "https://sandbox.wompi.co/v1"
  : "https://production.wompi.co/v1";

// 🔐 Llaves de Wompi desde .env
const WOMPI_PUBLIC_KEY = process.env.PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.PRIVATE_KEY;
const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET;

if (!WOMPI_PUBLIC_KEY || !WOMPI_PRIVATE_KEY || !INTEGRITY_SECRET) {
  console.error("❌ Llaves de Wompi faltantes en .env");
  process.exit(1);
}

// 🧪 Obtener token de aceptación desde Wompi
const obtenerTokenAceptacion = async () => {
  try {
    const response = await axios.get(`${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`);
    return response.data?.data?.presigned_acceptance?.acceptance_token;
  } catch (error) {
    console.error("❌ Error al obtener token:", error.response?.data || error.message);
    return null;
  }
};

// 📧 Validador simple de correos
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 💳 POST /pago/pse — Iniciar transacción PSE con Wompi
router.post("/pse", async (req, res) => {
  console.log("📩 POST recibido en /pago/pse");

  try {
    const {
      usuario,
      valor,
      document,
      document_type,
      financial_institution_code,
      nombre_cliente,
      banco_nombre,
      telefono_cliente // ← opcional, si lo envías desde el frontend
    } = req.body;

    // 🛑 Validaciones básicas
    if (typeof valor !== "number" || valor < 1500) {
      return res.status(400).json({ error: "Monto mínimo permitido: $1.500 COP." });
    }

    if (
      !usuario || !validarEmail(usuario) ||
      !document || !document_type || !financial_institution_code ||
      !nombre_cliente || !banco_nombre
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos o están mal formados." });
    }

    if (process.env.WOMPI_ENV === "sandbox" && !["1", "2"].includes(financial_institution_code)) {
      return res.status(400).json({ error: "Banco inválido en entorno de pruebas (usa código 1 o 2)." });
    }

    const tokenAceptacion = await obtenerTokenAceptacion();
    if (!tokenAceptacion) {
      return res.status(500).json({ error: "No se obtuvo token de aceptación desde Wompi." });
    }

    const referencia = `PAGO_${Date.now()}`;
    const redirectURL = `http://localhost:5000/estado/${referencia}`;
    const montoCentavos = parseInt(valor * 100, 10);

    // 📦 Construir payload para la transacción PSE
    const pagoData = {
      acceptance_token: tokenAceptacion,
      amount_in_cents: montoCentavos,
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
      },
      customer_data: {
        full_name: nombre_cliente,
        phone_number: telefono_cliente || "3001234567", // ← usa fijo si no lo envías
        legal_id: String(document),
        legal_id_type: document_type
      },
      signature: crypto.createHash("sha256")
        .update(`${referencia}${montoCentavos}COP${INTEGRITY_SECRET}`)
        .digest("hex")
    };

    console.log("📦 Payload enviado a Wompi:", JSON.stringify(pagoData, null, 2));
    console.log("📤 Enviando transacción a Wompi...");

    const respuesta = await axios.post(`${WOMPI_BASE_URL}/transactions`, pagoData, {
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const respuestaData = respuesta.data?.data;
    console.log("✅ Transacción creada:", respuestaData.reference);

    // 💾 Guardar datos del pago en MongoDB
    try {
      await Pago.create({
        reference: referencia,
        status: respuestaData.status || "PENDING",
        amount_in_cents: montoCentavos,
        customer_email: usuario,
        user_email: usuario,
        payment_method_type: "PSE",
        bank_name: banco_nombre,
        attempts: 1
      });
    } catch (err) {
      console.error("❌ Error guardando pago en MongoDB:", err.message);
    }

    res.status(200).json({
      mensaje: "✅ Transacción iniciada",
      reference: referencia,
      redirect_url: respuestaData.redirect_url
    });

  } catch (error) {
    console.error("❌ Error procesando transacción PSE:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al iniciar el pago con Wompi." });
  }
});

// 🏦 GET /pago/bancos — Bancos de prueba para entorno Sandbox
router.get("/bancos", (req, res) => {
  res.json([
    { nombre: "Banco que aprueba (Sandbox)", codigo: "1" },
    { nombre: "Banco que rechaza (Sandbox)", codigo: "2" }
  ]);
});

// 🔍 GET /pago/:reference — Consultar estado y datos del pago por referencia
router.get("/:reference", async (req, res) => {
  try {
    const pago = await Pago.findOne({ reference: req.params.reference });
    if (!pago) return res.status(404).json({ error: "Referencia no encontrada." });
    res.status(200).json(pago);
  } catch (error) {
    console.error("❌ Error al buscar referencia:", error.message);
    res.status(500).json({ error: "Error interno al consultar el pago." });
  }
});

// 🧾 GET /pago/ultimos-pagos — Listado de últimos pagos
router.get("/ultimos-pagos", async (req, res) => {
  try {
    const pagos = await Pago.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(pagos.map(p => ({
      reference: p.reference,
      status: p.status,
      email: p.customer_email
    })));
  } catch (error) {
    console.error("❌ Error al consultar últimos pagos:", error.message);
    res.status(500).json({ error: "No se pudo obtener pagos recientes." });
  }
});

module.exports = router;
