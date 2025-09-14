// pagoEstilos.js
export const getPagoEstilos = (loading) => ({
  contenedor: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    textAlign: "center"
  },
  titulo: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#333"
  },
  campo: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  etiqueta: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: "1rem",
    marginBottom: "0.3rem",
    color: "#444"
  },
  total: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginTop: "2rem",
    color: "#333"
  },
  mensaje: {
    fontWeight: "bold",
    marginTop: "1rem",
    color: loading ? "#555" : "green"
  },
  boton: {
    backgroundColor: loading ? "#ccc" : "#4CAF50",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "20px"
  }
});
