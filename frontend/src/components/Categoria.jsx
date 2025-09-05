// frontend/src/components/Categoria.jsx

import { useNavigate } from "react-router-dom";
import "./Categoria.css"; // ← opcional si quieres estilos separados

function Categoria() {
  const navigate = useNavigate();

  const categorias = ["Electrónica", "Hogar", "Ropa", "Otros","Accesorios"];

  const irACategoria = (nombre) => {
    navigate(`/productos/${nombre}`);
  };

  return (
    <div className="contenedor-categorias">
      <h2 className="titulo-categorias">🗂️ Categorías</h2>
      <div className="grid-categorias">
        {categorias.map((cat) => (
          <button
            key={cat}
            className="boton-categoria"
            onClick={() => irACategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Categoria;
