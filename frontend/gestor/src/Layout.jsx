import { Outlet, Link } from "react-router";
import { useAuth } from "./Auth";

export const Layout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/pacientes">Pacientes</Link></li>
          <li><Link to="/medicos">Médicos</Link></li>
          <li><Link to="/turnos">Turnos</Link></li>
        </ul>

        <ul>
          {!isAuthenticated && (
            <>
              <li><Link to="/login">Ingresar</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
            </>
          )}

          {isAuthenticated && (
            <li>
              <button onClick={logout} className="contrast">
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>
      </nav>

      <Outlet />
    </main>
  );
};
