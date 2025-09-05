// frontend/src/components/Categoria.jsx

import "./Categoria.css";

function Categoria({ setCategoria, categoriaSeleccionada }) {
  const categorias = ["Electrónica", "Hogar", "Ropa", "Otros"];

  return (
    <div className="contenedor-categorias">
      <h2 className="titulo-categorias">🗂️ Categorías</h2>
      <div className="grid-categorias">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`boton-categoria ${
              cat === categoriaSeleccionada ? "activa" : ""
            }`}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Categoria;
