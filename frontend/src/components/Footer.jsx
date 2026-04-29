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
            style={{ color: modoOscuro ? "#f5f5f5" : "#333", textDecoration: "none" }}
          >
            gggarciadiaz@gmail.com
          </a>
        </p>
      </div>
      <p>© 2026 Wish Marketplace – Mercado de Deseos</p>
    </footer>
  );
};

export default Footer;