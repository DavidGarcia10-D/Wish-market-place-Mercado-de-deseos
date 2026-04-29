import React from "react";

const Privacidad = ({ modoOscuro }) => {
  const estilos = {
    base: {
      padding: "1rem",
      lineHeight: "1.6",
      textAlign: "center", // ✅ Centrar todo el texto
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
    <div style={estiloFinal}>
      <h1>Política de Privacidad</h1>
      <p><strong>Última actualización:</strong> 29 de Abril de 2026</p>

      <p>
        Wish Marketplace – Mercado de Deseos gestiona esta tienda y sitio web,
        incluidos los datos, el contenido, las funciones, las herramientas, los
        productos y los servicios para ofrecerle una experiencia de compra
        seleccionada (los “Servicios”).
      </p>

      <p>
        Esta Política de privacidad describe cómo recopilamos, utilizamos y
        divulgamos su información personal cuando visita, utiliza o realiza una
        compra u otra transacción a través de los Servicios o cuando se comunica
        con nosotros por cualquier otro medio.
      </p>

      <h2>Información personal que recopilamos</h2>
      <ul style={{ listStylePosition: "inside" }}>
        <li>Detalles de contacto: nombre, dirección, teléfono, correo electrónico.</li>
        <li>Información financiera: datos de tarjetas y transacciones.</li>
        <li>Información de cuenta: usuario, contraseña, preferencias.</li>
        <li>Información de transacciones: artículos consultados, comprados, devueltos.</li>
        <li>Comunicaciones con nosotros: reclamaciones, soporte.</li>
        <li>Información del dispositivo: navegador, IP, identificadores.</li>
        <li>Información de uso: interacción con los Servicios.</li>
      </ul>

      <h2>Fuentes de información</h2>
      <p>
        Recopilamos datos directamente de usted, automáticamente mediante cookies
        y tecnologías similares, de proveedores de servicios y de terceros
        asociados.
      </p>

      <h2>Cómo utilizamos su información</h2>
      <ul style={{ listStylePosition: "inside" }}>
        <li>Prestar y mejorar los Servicios.</li>
        <li>Marketing y publicidad personalizada.</li>
        <li>Seguridad y prevención de fraudes.</li>
        <li>Atención al cliente y comunicaciones.</li>
        <li>Cumplimiento de obligaciones legales.</li>
      </ul>

      <h2>Divulgación de información</h2>
      <p>
        Podemos compartir su información con proveedores (ej. Wompi para pagos),
        partners comerciales, afiliados y en casos de requerimientos legales.
      </p>

      <p>
        Al utilizar nuestros Servicios, usted reconoce haber leído y entendido
        esta Política de privacidad.
      </p>
    </div>
  );
};

export default Privacidad;