import React from "react";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>✅ App cargó correctamente</h1>} />
    </Routes>
  );
};

export default App;