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


    // Email
    if (!usuario.trim())
      return alert("El email es obligatorio");

    if (usuario.trim().length > 100)
      return alert("El email no puede superar 100 caracteres");

    // Regex básica de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario))
      return alert("Debe ingresar un email válido");

    // Password
    if (!password.trim())
      return alert("La contraseña es obligatoria");

    if (password.length < 8)
      return alert("La contraseña debe tener al menos 8 caracteres");

    if (!/[a-z]/.test(password))
      return alert("La contraseña debe contener al menos una letra minúscula");

    if (!/[A-Z]/.test(password))
      return alert("La contraseña debe contener al menos una letra mayúscula");

    if (!/[0-9]/.test(password))
      return alert("La contraseña debe contener al menos un número");

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return alert("La contraseña debe contener al menos un símbolo");


    const ok = await login(usuario, password);

    if (ok) {
      navigate("/");
    } else {
      alert("Email o contraseña incorrectos");
    }
  };

  return (
    <main className="container">
      <article>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
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