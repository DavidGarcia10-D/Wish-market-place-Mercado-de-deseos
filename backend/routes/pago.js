const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();

const Pago = require("../models/Pago");

const IS_PRODUCTION = process.env.WOMPI_ENV === "production";

const WOMPI_BASE_URL = IS_PRODUCTION
  ? "https://production.wompi.co/v1"
  : "https://sandbox.wompi.co/v1";

const WOMPI_PUBLIC_KEY = process.env.PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.PRIVATE_KEY;
const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET;

if (!WOMPI_PUBLIC_KEY || !WOMPI_PRIVATE_KEY || !INTEGRITY_SECRET) {
  console.error("❌ Llaves de Wompi faltantes en .env");
  process.exit(1);
}

console.log(`🌐 Entorno Wompi: ${IS_PRODUCTION ? "Producción" : "Sandbox"}`);
console.log(`🔗 URL base: ${WOMPI_BASE_URL}`);

const obtenerTokenAceptacion = async () => {
  try {
    const response = await axios.get(`${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`);
    const token = response.data?.data?.presigned_acceptance?.acceptance_token;

    let contractId = response.data?.data?.presigned_acceptance?.contract_id;
    if (!contractId && token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        contractId = payload.contract_id;
      } catch (err) {
        console.error("❌ No se pudo decodificar contract_id del token:", err.message);
      }
    }

    console.log("🕒 [obtenerTokenAceptacion] Token obtenido en:", new Date().toISOString());
    console.log("🔍 [obtenerTokenAceptacion] acceptance_token:", token);
    console.log("🔍 [obtenerTokenAceptacion] contract_id:", contractId);

    return { token, contractId };
  } catch (error) {
    console.error("❌ [obtenerTokenAceptacion] Error:", error.response?.data || error.message);
    return { token: null, contractId: null };
  }
};

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validarTelefono = (telefono) => /^3\d{9}$/.test(telefono);

router.post("/pse", async (req, res) => {
  console.log("📩 [POST /pago/pse] Petición recibida");

  try {
    const {
      usuario,
      valor,
      document,
      document_type,
      financial_institution_code,
      nombre_cliente,
      banco_nombre,
      telefono_cliente,
      carrito,
      user_type
    } = req.body;

    console.log("🔍 [user_type recibido del frontend]:", user_type);

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

    if (!IS_PRODUCTION && !["1", "2"].includes(String(financial_institution_code))) {
      return res.status(400).json({ error: "Banco inválido en entorno de pruebas (usa código 1 o 2)." });
    }

    const { token: tokenAceptacion, contractId } = await obtenerTokenAceptacion();
    if (!tokenAceptacion || !contractId) {
      return res.status(500).json({ error: "No se obtuvo token de aceptación o contract_id desde Wompi." });
    }

    const referencia = `PAGO_${Date.now()}`;
    const FRONTEND_BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectURL = `${FRONTEND_BASE_URL}/estado/${referencia}`;
    const montoCentavos = parseInt(valor * 100, 10);

    const tipoUsuario = Number(user_type);
    const telefonoValidado = validarTelefono(telefono_cliente) ? telefono_cliente : "3001234567";

    console.log("🔍 [user_type enviado a Wompi]:", tipoUsuario);
    console.log("📌 [Datos clave]");
    console.log("💰 Monto en centavos:", montoCentavos);
    console.log("📄 Referencia:", referencia);
    console.log("🏦 Banco:", financial_institution_code, banco_nombre);
    console.log("👤 Tipo usuario:", tipoUsuario);
    console.log("📞 Teléfono validado:", telefonoValidado);

    const pagoData = {
      acceptance_token: tokenAceptacion,
      amount_in_cents: montoCentavos,
      currency: "COP",
      customer_email: usuario,
      reference: referencia,
      redirect_url: redirectURL,
      contract_id: contractId,
      payment_method: {
        type: "PSE",
        user_type: tipoUsuario,
        user_legal_id: String(document),
        user_legal_id_type: document_type,
        financial_institution_code: String(financial_institution_code),
        payment_description: "Pago a Tienda Wompi"
      },
      customer_data: {
        full_name: nombre_cliente,
        phone_number: telefonoValidado,
        legal_id: String(document),
        legal_id_type: document_type,
        payment_description: "Pago a Tienda Wompi"
      },
      signature: crypto.createHash("sha256")
        .update(`${referencia}${montoCentavos}COP${INTEGRITY_SECRET}`)
        .digest("hex")
    };

    console.log("📦 [Payload enviado a Wompi]:", JSON.stringify(pagoData, null, 2));
    console.log("📤 Enviando transacción a Wompi...");

    const respuesta = await axios.post(`${WOMPI_BASE_URL}/transactions`, pagoData, {
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("📥 [Respuesta completa de Wompi]:", JSON.stringify(respuesta.data, null, 2));

    const respuestaData = respuesta.data?.data;
    console.log("🆔 Transaction ID:", respuestaData?.id);
    console.log("📌 Status:", respuestaData?.status);
    console.log("📌 Status message:", respuestaData?.status_message);
    console.log("🔗 async_payment_url:", respuestaData?.payment_method?.extra?.async_payment_url);

    const urlPago = respuestaData?.payment_method?.extra?.async_payment_url;

    if (!urlPago) {
      const wompiError = respuesta.data?.error?.reason || respuesta.data?.error?.messages || "No se recibió async_payment_url";
      console.error("❌ [Error de Wompi]:", wompiError);
      return res.status(500).json({
        success: false,
        wompi_error: wompiError
      });
    }

    console.log("✅ Transacción creada:", respuestaData.reference);
    console.log("🔗 URL de pago:", urlPago);

    try {
      await Pago.create({
        reference: referencia,
        status: respuestaData.status || "PENDING",
        amount_in_cents: montoCentavos,
        customer_email: usuario,
        user_email: usuario,
        payment_method_type: "PSE",
        bank_name: banco_nombre,
        attempts: 1,
        productos: Array.isArray(carrito) ? carrito : [],
        user_type: tipoUsuario,
        phone_number: telefonoValidado,
        payment_description: "Pago a Tienda Wompi"
      });
    } catch (err) {
      console.error("❌ Error guardando pago en MongoDB:", err.message);
    }

    res.status(200).json({
      success: true,
      mensaje: "✅ Transacción iniciada",
      reference: referencia,
      url_pago: urlPago
    });

  } catch (error) {
    console.error("❌ [Error procesando transacción PSE]:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: "Error al iniciar el pago con Wompi.",
      wompi_error: error.response?.data || error.message
    });
  }
});

router.get("/bancos", (req, res) => {
  res.json([
    { nombre: "Banco que aprueba (Sandbox)", codigo: "1" },
    { nombre: "Banco que rechaza (Sandbox)", codigo: "2" }
  ]);
});

router.get("/:reference", async (req, res) => {
  try {
    const pago = await Pago.findOne({ reference: req.params.reference });
    if (!pago) {
      return res.status(404).json({ error: "Referencia no encontrada." });
    }
    res.status(200).json(pago);
  } catch (error) {
    console.error("❌ Error al buscar referencia:", error.message);
    res.status(500).json({ error: "Error interno al consultar el pago." });
  }
});

module.exports = router;
