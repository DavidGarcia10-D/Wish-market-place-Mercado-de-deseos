import React from "react";

const Reembolso = ({ modoOscuro }) => {
  const estilos = {
    base: { padding: "1rem", lineHeight: "1.6" },
    light: { backgroundColor: "#f5f5f5", color: "#333" },
    dark: { backgroundColor: "#222", color: "#f5f5f5" },
  };

  const estiloFinal = { ...estilos.base, ...(modoOscuro ? estilos.dark : estilos.light) };

  const colorLink = modoOscuro ? "#f5f5f5" : "#333";

  return (
    <div style={estiloFinal}>
      <h1>Política de Reembolso</h1>
      <p><strong>Última actualización:</strong> 6 de octubre de 2025</p>

      <h2>Procedimiento de cambio</h2>
      <p>
        Si deseas hacer el cambio de alguno de los productos adquiridos en nuestra tienda virtual,
        puedes hacerlo dentro de los cinco (5) días calendario desde la recepción del paquete.
        Debes escribir a <a href="mailto:contacto@mercadodeseos.com" style={{ color: colorLink }}>contacto@mercadodeseos.com</a>
        o a nuestra línea de atención WhatsApp +57 322 2863598, especificando:
      </p>
      <ul>
        <li>Nombre completo</li>
        <li>Cédula</li>
        <li>Número de pedido</li>
        <li>Fecha del pedido</li>
        <li>Número de contacto</li>
        <li>Producto</li>
      </ul>
      <p>
        Los costos de transporte y demás gastos asociados al cambio serán cubiertos por el cliente.
      </p>

      <h2>Condiciones del producto</h2>
      <p>
        El producto no debe estar usado, modificado o alterado. Debe estar en buen estado, limpio y
        con sus etiquetas originales. Los cambios pueden tardar hasta 10 días hábiles y solo se
        permite un cambio por producto.
      </p>
      <p>
        Los productos en promoción o con descuento no tienen cambio.
      </p>

      <h2>Error en la entrega</h2>
      <p>
        Si el producto entregado no corresponde al pedido, tienes cinco (5) días calendario para
        informar el error. En este caso, asumiremos los costos de recogida y envío del nuevo producto.
      </p>

      <h2>Derecho de retracto</h2>
      <p>
        De conformidad con el artículo 47 de la Ley 1480 de 2011, puedes retractarte de tu compra
        dentro de los cinco (5) días hábiles siguientes a la entrega. El contrato se resolverá y se
        reintegrará el dinero pagado, siempre que devuelvas el producto en las mismas condiciones en
        que lo recibiste. Los costos de transporte serán cubiertos por el consumidor.
      </p>

      <h2>Reversión del pago</h2>
      <p>
        Si tu compra fue realizada mediante tarjeta de crédito, débito u otro medio electrónico,
        podrás solicitar la reversión del pago dentro de los cinco (5) días hábiles siguientes en
        casos de fraude, transacción no solicitada, producto no recibido o defectuoso. Para ejercer
        este derecho, envía un correo a <a href="mailto:contacto@mercadodeseos.com" style={{ color: colorLink }}>contacto@mercadodeseos.com</a>
        con tu nombre completo, cédula y razón de la solicitud.
      </p>
      <p>
        La reversión de pago aplica únicamente para compras realizadas mediante mecanismos de comercio
        electrónico y será gestionada por tu entidad bancaria. Los usuarios que soliciten reversión de
        mala fe podrán ser sancionados por la Superintendencia de Industria y Comercio.
      </p>
    </div>
  );
};

export default Reembolso;