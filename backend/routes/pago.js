const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();

const Pago = require("../models/Pago");

const WOMPI_BASE_URL = process.env.WOMPI_ENV === "sandbox"
  ? "https://sandbox.wompi.co/v1"
  : "https://production.wompi.co/v1";

const WOMPI_PUBLIC_KEY = process.env.PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.PRIVATE_KEY;
const INTEGRITY_SECRET = process.env.INTEGRITY_SECRET;

if (!WOMPI_PUBLIC_KEY || !WOMPI_PRIVATE_KEY || !INTEGRITY_SECRET) {
  console.error("❌ Llaves de Wompi faltantes en .env");
  process.exit(1);
}

const obtenerTokenAceptacion = async () => {
  try {
    const response = await axios.get(`${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`);
    return response.data?.data?.presigned_acceptance?.acceptance_token;
  } catch (error) {
    console.error("❌ Error al obtener token:", error.response?.data || error.message);
    return null;
  }
};

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validarTelefono = (telefono) => /^3\d{9}$/.test(telefono);

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
      telefono_cliente,
      carrito,
      user_type
    } = req.body;

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

    if (process.env.WOMPI_ENV === "sandbox" && !["1", "2"].includes(String(financial_institution_code))) {
      return res.status(400).json({ error: "Banco inválido en entorno de pruebas (usa código 1 o 2)." });
    }

    const tokenAceptacion = await obtenerTokenAceptacion();
    if (!tokenAceptacion) {
      return res.status(500).json({ error: "No se obtuvo token de aceptación desde Wompi." });
    }

    const referencia = `PAGO_${Date.now()}`;
    const FRONTEND_BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectURL = `${FRONTEND_BASE_URL}/estado/${referencia}`;
    const montoCentavos = parseInt(valor * 100, 10);

    // ✅ Validación correcta: 1 = Natural, 2 = Jurídica
    const tipoUsuario = [1, 2].includes(Number(user_type)) ? Number(user_type) : 1;
    const telefonoValidado = validarTelefono(telefono_cliente) ? telefono_cliente : "3001234567";

    const pagoData = {
      acceptance_token: tokenAceptacion,
      amount_in_cents: montoCentavos,
      currency: "COP",
      customer_email: usuario,
      reference: referencia,
      redirect_url: redirectURL,
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

    console.log("📦 Payload enviado a Wompi:", JSON.stringify(pagoData, null, 2));
    console.log("📤 Enviando transacción a Wompi...");

    const respuesta = await axios.post(`${WOMPI_BASE_URL}/transactions`, pagoData, {
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const respuestaData = respuesta.data?.data;
    const urlPago = respuestaData?.payment_method?.extra?.async_payment_url;

    if (!urlPago) {
      console.error("❌ No se recibió async_payment_url desde Wompi.");
      return res.status(500).json({ error: "No se pudo obtener la URL de pago desde Wompi." });
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
    console.error("❌ Error procesando transacción PSE:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al iniciar el pago con Wompi." });
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
    if (!pago) return res.status(404).json({ error: "Referencia no encontrada." });
    res.status(200).json(pago);
  } catch (error) {
    console.error("❌ Error al buscar referencia:", error.message);
    res.status(500).json({ error: "Error interno al consultar el pago." });
  }
});

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
