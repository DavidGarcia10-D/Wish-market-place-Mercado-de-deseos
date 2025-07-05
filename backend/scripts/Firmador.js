// firmador.js
const crypto = require("crypto");

const payload ='{"event":"transaction.updated","data":{"transaction":{"reference":"PAGO_TEST123","status":"APPROVED"}}}'

const integrityKey = "test_integrity_Zghb5UZSrEFOifozmn43YIHJFUjrMJzU";


const signature = crypto
  .createHmac("sha256", integrityKey)
  .update(payload)
  .digest("hex");

console.log("🔐 X-Integrity:", signature);
