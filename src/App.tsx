import { Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";

const Home = lazy(() => import("./pages/Home"));
const Character = lazy(() => import("./pages/Character"));

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="character/:id"
        element={
          <Suspense fallback={<CircularProgress />}>
            <Character />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
