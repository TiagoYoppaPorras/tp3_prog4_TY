import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import { BrowserRouter, Routes, Route } from "react-router";

import { AuthProvider, AuthPage } from "./Auth.jsx";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";

import { Pacientes } from "./Pacientes/Pacientes.jsx";
import { CrearPaciente } from "./Pacientes/CrearPaciente.jsx";
import { ModificarPaciente } from "./Pacientes/ModificarPaciente.jsx";

import { Medicos } from "./Medicos/Medicos.jsx";
import { CrearMedico } from "./Medicos/CrearMedico.jsx";
import { ModificarMedico } from "./Medicos/ModificarMedico.jsx";

import { Turnos } from "./Turnos/Turnos.jsx";
import { CrearTurno } from "./Turnos/CrearTurno.jsx";
import { ModificarTurno } from "./Turnos/ModificarTurno.jsx";

import { Login } from "./Login.jsx";
import { Registro } from "./registro.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* LOGIN + REGISTRO */}
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />

            {/* PACIENTES */}
            <Route
              path="pacientes"
              element={
                <AuthPage>
                  <Pacientes />
                </AuthPage>
              }
            />
            <Route
              path="pacientes/crear"
              element={
                <AuthPage>
                  <CrearPaciente />
                </AuthPage>
              }
            />
            <Route
              path="pacientes/:id/modificar"
              element={
                <AuthPage>
                  <ModificarPaciente />
                </AuthPage>
              }
            />

            {/* MEDICOS */}
            <Route
              path="medicos"
              element={
                <AuthPage>
                  <Medicos />
                </AuthPage>
              }
            />
            <Route
              path="medicos/crear"
              element={
                <AuthPage>
                  <CrearMedico />
                </AuthPage>
              }
            />
            <Route
              path="medicos/:id/modificar"
              element={
                <AuthPage>
                  <ModificarMedico />
                </AuthPage>
              }
            />

            {/* TURNOS */}
            <Route
              path="turnos"
              element={
                <AuthPage>
                  <Turnos />
                </AuthPage>
              }
            />
            <Route
              path="turnos/crear"
              element={
                <AuthPage>
                  <CrearTurno />
                </AuthPage>
              }
            />
            <Route
              path="turnos/:id/modificar"
              element={
                <AuthPage>
                  <ModificarTurno />
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
