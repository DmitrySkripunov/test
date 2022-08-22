import { Route, Routes } from "react-router-dom";
import React, { lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Character = lazy(() => import("./pages/Character"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="caracter/:id" element={<Character />} />
    </Routes>
  );
}

export default App;
