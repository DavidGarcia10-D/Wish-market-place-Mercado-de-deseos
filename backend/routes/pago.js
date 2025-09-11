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

    if (typeof valor !== "number" || valor < 1500) {
      return res.status(400).json({ error: "Monto mínimo permitido: $1.500 COP." });
    }

    if (
      !usuario || !validarEmail(usuario) ||
      !document || !document_type || !financial_institution_code ||
      !nombre_cliente || !banco_nombre || !telefono_cliente
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos o están mal formados." });
    }

    if (!validarTelefono(telefono_cliente)) {
      return res.status(400).json({ error: "Número de teléfono inválido o faltante." });
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

    const pagoData = {
      customer_email: usuario,
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
        phone_number: `57${telefono_cliente}`
      },
      acceptance_token: tokenAceptacion,
      amount_in_cents: montoCentavos,
      currency: "COP",
      reference: referencia,
      redirect_url: redirectURL,
      contract_id: contractId,
      signature: crypto.createHash("sha256")
        .update(`${referencia}${montoCentavos}COP${INTEGRITY_SECRET}`)
        .digest("hex")
    };

    console.log("📦 Payload enviado a Wompi:", JSON.stringify(pagoData, null, 2));

    const respuesta = await axios.post(`${WOMPI_BASE_URL}/transactions`, pagoData, {
      headers: {
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const respuestaData = respuesta.data?.data;
    const transaccionId = respuestaData?.id;
    let urlPago = null;

    for (let intento = 0; intento < 5; intento++) {
      try {
        const consulta = await axios.get(`${WOMPI_BASE_URL}/transactions/${transaccionId}`, {
          headers: {
            Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`
          }
        });

        urlPago = consulta.data?.data?.payment_method?.extra?.async_payment_url;

        if (urlPago) {
          console.log(`🔗 [Polling] async_payment_url obtenido en intento ${intento + 1}:`, urlPago);
          break;
        }

        console.log(`⏳ [Polling] Intento ${intento + 1}: URL aún no disponible`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(`❌ [Polling] Error en intento ${intento + 1}:`, err.message);
        break;
      }
    }

    if (!urlPago) {
      const wompiError = respuesta.data?.error?.reason || respuesta.data?.error?.messages || "No se recibió async_payment_url";
      console.error("❌ Error desde Wompi:", wompiError);
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
        phone_number: telefono_cliente,
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
    res.status(500).json({
      success: false,
      error: "Error al iniciar el pago con Wompi.",
      wompi_error: error.response?.data || error.message
    });
  }
});

// 🆕 Endpoint dinámico para bancos activos desde Wompi
router.get("/bancos-wompi", async (req, res) => {
  console.log("📥 [GET /bancos-wompi] Petición recibida (URL fija)");

  try {
    const response = await fetch("https://production.wompi.co/v1/pse/financial_institutions", {
      method: "GET",
      headers: {
        "User-Agent": "WishMarketPlace/1.0",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Wompi respondió con ${response.status}`);
    }

    const data = await response.json();
    const bancos = data?.data || [];
    console.log(`🏦 Bancos recibidos: ${bancos.length}`);
    res.status(200).json(bancos);
  } catch (error) {
    console.error("❌ Error al obtener bancos desde Wompi:", error.message);
    res.status(500).json({ error: "No se pudo obtener la lista de bancos." });
  }
});


// 🔍 Consulta por referencia
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
