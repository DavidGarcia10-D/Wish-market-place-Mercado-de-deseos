import React from "react";

const Footer = ({ modoOscuro }) => {
  const estilos = {
    base: {
      padding: "1rem",
      textAlign: "center",
      fontSize: "0.9rem",
    },
    light: {
      backgroundColor: "#f5f5f5",
      color: "#333",
    },
    dark: {
      backgroundColor: "#222",
      color: "#f5f5f5",
    },
  };

  const estiloFinal = {
    ...estilos.base,
    ...(modoOscuro ? estilos.dark : estilos.light),
  };

  const colorLink = modoOscuro ? "#f5f5f5" : "#333";

  return (
    <footer style={estiloFinal}>
      <div style={{ marginBottom: "0.5rem" }}>
        <p>
          📞 Teléfono: <span>3133594678</span>
        </p>
        <p>
          📧 Correo:{" "}
          <a
            href="mailto:gggarciadiaz@gmail.com"
            style={{ color: colorLink, textDecoration: "none" }}
          >
            gggarciadiaz@gmail.com
          </a>
        </p>
      </div>

      {/* Logos de medios de pago Wompi */}
      <div style={{ marginBottom: "0.5rem" }}>
        <p>Pagos seguros con Wompi</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
          <img src="https://images.seeklogo.com/logo-png/43/1/pse-logo-png_seeklogo-433463.png" alt="PSE" style={{ height: "35px" }} />
          <img src="https://img.icons8.com/?size=50&id=1429&format=png" alt="Visa" style={{ height: "35px" }} />
          <img src="https://www.mastercard.com/brandcenter/us/en/home/_jcr_content/root/container/container_1578756628/container_1860858030/container/teaser4_copy_2821464.coreimg.png/1751029673412/mastercard-symbol-square-black.png" style={{ height: "35px" }} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" style={{ height: "35px" }} />
        </div>
      </div>

      {/* Políticas */}
      <div style={{ marginBottom: "0.5rem" }}>
        <a href="/privacidad" style={{ color: colorLink, margin: "0 10px", textDecoration: "none" }}>Política de Privacidad</a>
        <a href="/terminos" style={{ color: colorLink, margin: "0 10px", textDecoration: "none" }}>Términos y Condiciones</a>
        <a href="/devoluciones" style={{ color: colorLink, margin: "0 10px", textDecoration: "none" }}>Política de Devoluciones</a>
      </div>

      <p>© 2026 Wish Marketplace – Mercado de Deseos</p>
    </footer>
  );
};

export default Footer;