import React from "react";

const Terminos = ({ modoOscuro }) => {
  const estilos = {
    base: { padding: "1rem", lineHeight: "1.6" },
    light: { backgroundColor: "#f5f5f5", color: "#333" },
    dark: { backgroundColor: "#222", color: "#f5f5f5" },
  };

  const estiloFinal = { ...estilos.base, ...(modoOscuro ? estilos.dark : estilos.light) };

  return (
    <div style={estiloFinal}>
      <h1>Términos de Servicio</h1>
      <p><strong>Última actualización:</strong> 6 de octubre de 2025</p>

      <h2>Información General</h2>
      <p>
        Este sitio web es operado por Wish Marketplace – Mercado de Deseos. En todo el sitio,
        los términos “nosotros”, “nos” y “nuestro” se refieren a la empresa. Ofrecemos este
        sitio web, incluyendo toda la información, herramientas y servicios disponibles para
        ti, el usuario, condicionado a la aceptación de todos los términos, condiciones,
        políticas y notificaciones aquí establecidos.
      </p>

      <p>
        Al visitar nuestro sitio y/o comprar algo de nosotros, participas en nuestro “Servicio”
        y aceptas los siguientes términos y condiciones (“Términos de Servicio”, “Términos”).
      </p>

      <h2>Sección 1 - Términos de la tienda en línea</h2>
      <p>
        Al utilizar este sitio, declaras que tienes la mayoría de edad en tu estado o provincia
        de residencia. No puedes usar nuestros productos con fines ilegales ni transmitir
        virus o código destructivo. El incumplimiento dará lugar al cese inmediato de tus
        servicios.
      </p>

      <h2>Sección 2 - Condiciones generales</h2>
      <p>
        Nos reservamos el derecho de rechazar la prestación de servicio a cualquier persona,
        por cualquier motivo y en cualquier momento. Tu contenido puede ser transferido sin
        encriptar a través de varias redes, aunque la información de tarjetas de crédito
        siempre se transfiere encriptada.
      </p>

      <h2>Sección 3 - Exactitud y actualidad de la información</h2>
      <p>
        No nos hacemos responsables si la información disponible en este sitio no es exacta,
        completa o actual. El material es provisto solo para información general y cualquier
        dependencia en él es bajo tu propio riesgo.
      </p>

      <h2>Sección 4 - Modificaciones al servicio y precios</h2>
      <p>
        Los precios de nuestros productos están sujetos a cambio sin aviso. Nos reservamos
        el derecho de modificar o discontinuar el servicio en cualquier momento sin previo
        aviso.
      </p>

      <h2>Sección 5 - Productos o servicios</h2>
      <p>
        Ciertos productos pueden estar disponibles exclusivamente en línea y sujetos a
        devolución o cambio según nuestra política. Nos reservamos el derecho de limitar
        las ventas por persona, región o jurisdicción.
      </p>

      <h2>Sección 6 - Exactitud de facturación e información de cuenta</h2>
      <p>
        Nos reservamos el derecho de rechazar cualquier pedido. Te comprometes a proporcionar
        información actual, completa y precisa de la compra y cuenta utilizada para todas
        las compras realizadas en nuestra tienda.
      </p>

      <h2>Sección 7 - Herramientas opcionales</h2>
      <p>
        Es posible que te proporcionemos acceso a herramientas de terceros sobre las que no
        tenemos control. El uso de estas herramientas es bajo tu propio riesgo y discreción.
      </p>
    </div>
  );
};

export default Terminos;