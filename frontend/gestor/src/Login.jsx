import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await login(usuario, password);

    if (ok) {
      navigate("/"); // ✔ redirige correctamente al Home
    }
  };

  return (
    <main className="container">
      <article>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Ingresar</button>
        </form>
      </article>
    </main>
  );
};
